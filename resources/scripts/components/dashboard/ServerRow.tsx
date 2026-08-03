// ServerRow.tsx (Premium Version)
import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { 
  Server as ServerIcon, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi,
  ChevronRight,
  Clock,
  Activity
} from 'lucide-react';
import Spinner from '@/components/elements/Spinner';
import isEqual from 'react-fast-compare';

type Timer = ReturnType<typeof setInterval>;

interface StatusBadgeProps {
    status: ServerPowerState | undefined;
    isSuspended: boolean;
    isTransferring: boolean;
    isNodeUnderMaintenance: boolean;
}

const StatusBadge = ({ status, isSuspended, isTransferring, isNodeUnderMaintenance }: StatusBadgeProps) => {
    if (isSuspended) {
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-500/20">Suspended</span>;
    }
    if (isNodeUnderMaintenance) {
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">Maintenance</span>;
    }
    if (isTransferring) {
        return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20">Transferring</span>;
    }
    if (status === 'running') {
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            Online
        </span>;
    }
    if (status === 'offline') {
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
            Offline
        </span>;
    }
    return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">Installing</span>;
};

export default memo(({ server, className }: { server: Server; className?: string }) => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
    const [stats, setStats] = useState<ServerStats | null>(null);

    const getStats = () =>
        getServerResourceUsage(server.uuid)
            .then((data) => setStats(data))
            .catch((error) => console.error(error));

    useEffect(() => {
        setIsSuspended(stats?.isSuspended || server.status === 'suspended');
    }, [stats?.isSuspended, server.status]);

    useEffect(() => {
        if (isSuspended || server.isNodeUnderMaintenance) return;

        getStats().then(() => {
            interval.current = setInterval(() => getStats(), 30000);
        });

        return () => {
            interval.current && clearInterval(interval.current);
        };
    }, [isSuspended, server.isNodeUnderMaintenance]);

    const diskLimit = server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : 'Unlimited';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : 'Unlimited';
    const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + '%' : 'Unlimited';

    const cpuPercent = stats ? Math.min(stats.cpuUsagePercent, 100) : 0;
    const memoryPercent = stats && server.limits.memory !== 0 ? (stats.memoryUsageInBytes / mbToBytes(server.limits.memory)) * 100 : 0;
    const diskPercent = stats && server.limits.disk !== 0 ? (stats.diskUsageInBytes / mbToBytes(server.limits.disk)) * 100 : 0;

    const isAlarm = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

    return (
        <Link to={`/server/${server.id}`} className={`block group ${className || ''}`}>
            <div className="relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 p-5 hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-600/5 transition-all duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                
                <div className="relative flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Server Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <ServerIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-lg font-semibold text-white truncate">{server.name}</h3>
                                {server.description && (
                                    <p className="text-sm text-blue-200/60 truncate">{server.description}</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-blue-200/40">
                            <Wifi className="w-4 h-4" />
                            {server.allocations
                                .filter((alloc) => alloc.isDefault)
                                .map((allocation) => (
                                    <span key={allocation.ip + allocation.port.toString()}>
                                        {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                    </span>
                                ))}
                        </div>
                    </div>

                    {/* Status & Stats */}
                    <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                        <StatusBadge 
                            status={stats?.status}
                            isSuspended={isSuspended}
                            isTransferring={server.isTransferring}
                            isNodeUnderMaintenance={server.isNodeUnderMaintenance}
                        />

                        {!isSuspended && !server.isNodeUnderMaintenance && stats && (
                            <>
                                {/* CPU */}
                                <div className="flex items-center gap-2">
                                    <Cpu className={`w-4 h-4 ${cpuPercent >= 90 ? 'text-red-400' : 'text-blue-400/60'}`} />
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ${
                                            cpuPercent >= 90 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'
                                        }`} style={{ width: `${Math.min(cpuPercent, 100)}%` }} />
                                    </div>
                                    <span className={`text-xs ${cpuPercent >= 90 ? 'text-red-400' : 'text-blue-200/60'}`}>
                                        {cpuPercent.toFixed(1)}%
                                    </span>
                                </div>

                                {/* Memory */}
                                <div className="flex items-center gap-2">
                                    <MemoryStick className={`w-4 h-4 ${isAlarm(stats.memoryUsageInBytes, server.limits.memory) ? 'text-red-400' : 'text-blue-400/60'}`} />
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ${
                                            isAlarm(stats.memoryUsageInBytes, server.limits.memory) ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-purple-400'
                                        }`} style={{ width: `${Math.min(memoryPercent, 100)}%` }} />
                                    </div>
                                    <span className={`text-xs ${isAlarm(stats.memoryUsageInBytes, server.limits.memory) ? 'text-red-400' : 'text-blue-200/60'}`}>
                                        {bytesToString(stats.memoryUsageInBytes)}
                                    </span>
                                </div>

                                {/* Disk */}
                                <div className="flex items-center gap-2">
                                    <HardDrive className={`w-4 h-4 ${isAlarm(stats.diskUsageInBytes, server.limits.disk) ? 'text-red-400' : 'text-blue-400/60'}`} />
                                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-500 ${
                                            isAlarm(stats.diskUsageInBytes, server.limits.disk) ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-orange-400'
                                        }`} style={{ width: `${Math.min(diskPercent, 100)}%` }} />
                                    </div>
                                    <span className={`text-xs ${isAlarm(stats.diskUsageInBytes, server.limits.disk) ? 'text-red-400' : 'text-blue-200/60'}`}>
                                        {bytesToString(stats.diskUsageInBytes)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 text-blue-200/40 text-xs">
                                    <Clock className="w-3 h-3" />
                                    <span>{stats?.lastPolled ? new Date(stats.lastPolled).toLocaleTimeString() : 'N/A'}</span>
                                </div>
                            </>
                        )}

                        {(!stats || isSuspended || server.isNodeUnderMaintenance) && !isSuspended && !server.isNodeUnderMaintenance && (
                            <div className="flex items-center">
                                <Spinner size={'small'} />
                            </div>
                        )}

                        <ChevronRight className="w-5 h-5 text-blue-400/40 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}, isEqual);