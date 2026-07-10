// ServerDetailsBlock.tsx (tanpa lucide-react)
import React, { useEffect, useMemo, useState } from 'react';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import { ServerContext } from '@/state/server';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import UptimeDuration from '@/components/server/UptimeDuration';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMicrochip, 
    faMemory, 
    faHardDrive, 
    faWifi, 
    faClock, 
    faArrowUp, 
    faArrowDown,
    faServer
} from '@fortawesome/free-solid-svg-icons';

type Stats = Record<'memory' | 'cpu' | 'disk' | 'uptime' | 'rx' | 'tx', number>;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.04);
    transition: all 0.25s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.04);
        transform: translateY(-2px);
    }
`;

const StatHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    svg {
        width: 16px;
        height: 16px;
        color: #6B7280;
    }
`;

const StatLabel = styled.span`
    font-size: 0.7rem;
    font-weight: 500;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const StatValue = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 0.25rem;
`;

const StatLimit = styled.span`
    font-size: 0.75rem;
    color: #6B7280;
    font-weight: 400;
`;

const ProgressBar = styled.div<{ color: string }>`
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 0.25rem;
`;

const ProgressFill = styled.div<{ value: number; color: string }>`
    width: ${props => Math.min(props.value, 100)}%;
    height: 100%;
    background: ${props => props.color};
    border-radius: 999px;
    transition: width 0.6s ease;
`;

const getProgressColor = (value: number, max: number): string => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    if (percentage > 90) return '#EF4444';
    if (percentage > 75) return '#F59E0B';
    return '#3B82F6';
};

const getStatus = (status: string | null): string => {
    if (status === 'running') return 'Online';
    if (status === 'offline') return 'Offline';
    if (status === 'installing') return 'Installing';
    if (status === 'starting') return 'Starting';
    return 'Unknown';
};

const ServerDetailsBlock = ({ className }: { className?: string }) => {
    const [stats, setStats] = useState<Stats>({ memory: 0, cpu: 0, disk: 0, uptime: 0, tx: 0, rx: 0 });

    const status = ServerContext.useStoreState((state) => state.status.value);
    const connected = ServerContext.useStoreState((state) => state.socket.connected);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((alloc) => alloc.isDefault);
        return !match ? 'n/a' : `${match.alias || ip(match.ip)}:${match.port}`;
    });

    const textLimits = useMemo(
        () => ({
            cpu: limits?.cpu ? `${limits.cpu}%` : '∞',
            memory: limits?.memory ? bytesToString(mbToBytes(limits.memory)) : '∞',
            disk: limits?.disk ? bytesToString(mbToBytes(limits.disk)) : '∞',
        }),
        [limits]
    );

    const memoryLimitBytes = limits.memory * 1024 * 1024;
    const diskLimitBytes = limits.disk * 1024 * 1024;

    useEffect(() => {
        if (!connected || !instance) return;
        instance.send(SocketRequest.SEND_STATS);
    }, [instance, connected]);

    useWebsocketEvent(SocketEvent.STATS, (data) => {
        let statsData: any = {};
        try {
            statsData = JSON.parse(data);
        } catch (e) {
            return;
        }
        setStats({
            memory: statsData.memory_bytes,
            cpu: statsData.cpu_absolute,
            disk: statsData.disk_bytes,
            tx: statsData.network.tx_bytes,
            rx: statsData.network.rx_bytes,
            uptime: statsData.uptime || 0,
        });
    });

    const isOffline = status === 'offline';

    return (
        <div className={className}>
            <Grid>
                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faMicrochip} />
                        <StatLabel>CPU Usage</StatLabel>
                    </StatHeader>
                    <StatValue>
                        {isOffline ? '-' : stats.cpu.toFixed(1)}%
                        <StatLimit> / {textLimits.cpu}</StatLimit>
                    </StatValue>
                    <ProgressBar color="#3B82F6">
                        <ProgressFill
                            value={isOffline ? 0 : (stats.cpu / (limits.cpu || 100)) * 100}
                            color={getProgressColor(stats.cpu, limits.cpu || 100)}
                        />
                    </ProgressBar>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faMemory} />
                        <StatLabel>Memory</StatLabel>
                    </StatHeader>
                    <StatValue>
                        {isOffline ? '-' : bytesToString(stats.memory)}
                        <StatLimit> / {textLimits.memory}</StatLimit>
                    </StatValue>
                    <ProgressBar color="#8B5CF6">
                        <ProgressFill
                            value={memoryLimitBytes > 0 ? (stats.memory / memoryLimitBytes) * 100 : 0}
                            color={getProgressColor(stats.memory, memoryLimitBytes)}
                        />
                    </ProgressBar>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faHardDrive} />
                        <StatLabel>Storage</StatLabel>
                    </StatHeader>
                    <StatValue>
                        {bytesToString(stats.disk)}
                        <StatLimit> / {textLimits.disk}</StatLimit>
                    </StatValue>
                    <ProgressBar color="#F59E0B">
                        <ProgressFill
                            value={diskLimitBytes > 0 ? (stats.disk / diskLimitBytes) * 100 : 0}
                            color={getProgressColor(stats.disk, diskLimitBytes)}
                        />
                    </ProgressBar>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faClock} />
                        <StatLabel>Uptime</StatLabel>
                    </StatHeader>
                    <StatValue>
                        {isOffline ? '-' : stats.uptime > 0 ? (
                            <UptimeDuration uptime={stats.uptime / 1000} />
                        ) : (
                            getStatus(status)
                        )}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faArrowDown} />
                        <StatLabel>Network In</StatLabel>
                    </StatHeader>
                    <StatValue>
                        {isOffline ? '-' : bytesToString(stats.rx)}
                        <StatLimit> / s</StatLimit>
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faArrowUp} />
                        <StatLabel>Network Out</StatLabel>
                    </StatHeader>
                    <StatValue>
                        {isOffline ? '-' : bytesToString(stats.tx)}
                        <StatLimit> / s</StatLimit>
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faWifi} />
                        <StatLabel>Address</StatLabel>
                    </StatHeader>
                    <StatValue style={{ fontSize: '0.95rem', wordBreak: 'break-all' }}>
                        {allocation}
                    </StatValue>
                </StatCard>

                <StatCard>
                    <StatHeader>
                        <FontAwesomeIcon icon={faServer} />
                        <StatLabel>Status</StatLabel>
                    </StatHeader>
                    <StatValue style={{ fontSize: '0.95rem' }}>
                        {getStatus(status)}
                    </StatValue>
                </StatCard>
            </Grid>
        </div>
    );
};

export default ServerDetailsBlock;