// ServerRow.tsx
import React, { memo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToString, ip } from '@/lib/formatters';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';
import { 
    Server as ServerIcon, 
    Power, 
    PowerOff, 
    Cpu, 
    MemoryStick, 
    HardDrive, 
    Ethernet,
    AlertCircle,
    Loader2
} from 'lucide-react';

type Timer = ReturnType<typeof setInterval>;

const Card = styled(Link)`
    display: block;
    text-decoration: none;
    background: rgba(24, 24, 27, 0.80);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 22px;
    padding: 22px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;

    &:hover {
        transform: translateY(-3px);
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }
`;

const CardContent = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const ServerName = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    color: #FFFFFF;
    margin: 0;
    letter-spacing: -0.01em;
`;

const ServerDescription = styled.p`
    font-size: 0.85rem;
    color: #A1A1AA;
    margin: 0;
    line-height: 1.5;
`;

const StatusBadge = styled.div<{ status: string }>`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    width: fit-content;

    svg {
        width: 14px;
        height: 14px;
    }

    ${({ status }) => {
        switch (status) {
            case 'running':
                return `
                    background: rgba(34, 197, 94, 0.12);
                    color: #22C55E;
                `;
            case 'offline':
                return `
                    background: rgba(239, 68, 68, 0.12);
                    color: #EF4444;
                `;
            case 'installing':
            case 'restoring_backup':
                return `
                    background: rgba(251, 191, 36, 0.12);
                    color: #F59E0B;
                `;
            case 'suspended':
                return `
                    background: rgba(185, 28, 28, 0.20);
                    color: #991B1B;
                `;
            default:
                return `
                    background: rgba(107, 114, 128, 0.12);
                    color: #6B7280;
                `;
        }
    }}
`;

const IPAddress = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #6B7280;

    svg {
        width: 16px;
        height: 16px;
    }
`;

const RightSection = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const ResourceItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const ResourceLabel = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;
    font-weight: 500;
    color: #6B7280;
    text-transform: uppercase;
    letter-spacing: 0.02em;

    svg {
        width: 14px;
        height: 14px;
    }
`;

const ResourceValue = styled.span`
    font-size: 0.85rem;
    font-weight: 500;
    color: #FFFFFF;
`;

const ProgressBar = styled.div<{ color: string }>`
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 4px;
    overflow: hidden;
    margin-top: 0.25rem;
`;

const ProgressFill = styled.div<{ value: number; color: string }>`
    width: ${props => Math.min(props.value, 100)}%;
    height: 100%;
    background: ${props => props.color};
    border-radius: 4px;
    transition: width 0.5s ease;
`;

const LoadingState = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 60px;
`;

const isAlarmState = (current: number, limit: number): boolean => limit > 0 && current / (limit * 1024 * 1024) >= 0.9;

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

    const getStatus = (): string => {
        if (isSuspended) return 'suspended';
        if (server.isTransferring) return 'transferring';
        if (server.status) return server.status;
        if (stats?.status) return stats.status;
        return 'offline';
    };

    const status = getStatus();
    const isRunning = status === 'running';
    const diskLimit = server.limits.disk !== 0 ? bytesToString(server.limits.disk * 1024 * 1024) : '∞';
    const memoryLimit = server.limits.memory !== 0 ? bytesToString(server.limits.memory * 1024 * 1024) : '∞';
    const cpuLimit = server.limits.cpu !== 0 ? `${server.limits.cpu}%` : '∞';

    const cpuUsage = stats?.cpuUsagePercent || 0;
    const memoryUsage = stats?.memoryUsageInBytes || 0;
    const diskUsage = stats?.diskUsageInBytes || 0;
    const memoryLimitBytes = server.limits.memory * 1024 * 1024;
    const diskLimitBytes = server.limits.disk * 1024 * 1024;

    const memoryPercent = memoryLimitBytes > 0 ? (memoryUsage / memoryLimitBytes) * 100 : 0;
    const diskPercent = diskLimitBytes > 0 ? (diskUsage / diskLimitBytes) * 100 : 0;

    const isLoading = !stats && !isSuspended && !server.isNodeUnderMaintenance;

    return (
        <Card to={`/server/${server.id}`} className={className}>
            <CardContent>
                <LeftSection>
                    <ServerName>{server.name}</ServerName>
                    {server.description && (
                        <ServerDescription>{server.description}</ServerDescription>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <StatusBadge status={status}>
                            {isRunning ? <Power /> : status === 'offline' ? <PowerOff /> : <AlertCircle />}
                            {status === 'running' ? 'Running' :
                             status === 'offline' ? 'Offline' :
                             status === 'installing' ? 'Installing' :
                             status === 'restoring_backup' ? 'Restoring' :
                             status === 'suspended' ? 'Suspended' :
                             status === 'transferring' ? 'Transferring' :
                             status === 'under_maintenance' ? 'Maintenance' :
                             'Unavailable'}
                        </StatusBadge>
                        <IPAddress>
                            <Ethernet />
                            {server.allocations
                                .filter((alloc) => alloc.isDefault)
                                .map((allocation) => (
                                    <span key={allocation.ip + allocation.port.toString()}>
                                        {allocation.alias || ip(allocation.ip)}:{allocation.port}
                                    </span>
                                ))}
                        </IPAddress>
                    </div>
                </LeftSection>

                <RightSection>
                    {isLoading ? (
                        <LoadingState>
                            <Spinner size={'small'} />
                        </LoadingState>
                    ) : isSuspended || server.isNodeUnderMaintenance ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', fontSize: '0.85rem' }}>
                            {isSuspended ? 'Server suspended' : 'Under maintenance'}
                        </div>
                    ) : (
                        <>
                            <ResourceItem>
                                <ResourceLabel>
                                    <Cpu /> CPU
                                </ResourceLabel>
                                <ResourceValue>{cpuUsage.toFixed(1)}%</ResourceValue>
                                <ProgressBar color="#DC2626">
                                    <ProgressFill value={cpuUsage} color="#DC2626" />
                                </ProgressBar>
                                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>of {cpuLimit}</span>
                            </ResourceItem>

                            <ResourceItem>
                                <ResourceLabel>
                                    <MemoryStick /> RAM
                                </ResourceLabel>
                                <ResourceValue>{bytesToString(memoryUsage)}</ResourceValue>
                                <ProgressBar color="#3B82F6">
                                    <ProgressFill value={memoryPercent} color="#3B82F6" />
                                </ProgressBar>
                                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>of {memoryLimit}</span>
                            </ResourceItem>

                            <ResourceItem>
                                <ResourceLabel>
                                    <HardDrive /> Disk
                                </ResourceLabel>
                                <ResourceValue>{bytesToString(diskUsage)}</ResourceValue>
                                <ProgressBar color="#F59E0B">
                                    <ProgressFill value={diskPercent} color="#F59E0B" />
                                </ProgressBar>
                                <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>of {diskLimit}</span>
                            </ResourceItem>
                        </>
                    )}
                </RightSection>
            </CardContent>
        </Card>
    );
}, isEqual);