// ServerConsoleContainer.tsx
import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';
import styled from 'styled-components/macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faPowerOff, faCircle, faTriangleExclamation, faNetworkWired } from '@fortawesome/free-solid-svg-icons';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const HeaderCard = styled.div`
    background: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 22px;
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    min-width: 0;
    flex-wrap: wrap;
`;

const ServerIconWrapper = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: rgba(220, 38, 38, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #DC2626;
    flex-shrink: 0;

    svg {
        width: 24px;
        height: 24px;
    }
`;

const ServerInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
`;

const ServerName = styled.h1`
    font-size: 1.35rem;
    font-weight: 700;
    color: #FFFFFF;
    margin: 0;
    letter-spacing: -0.01em;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 480px) {
        font-size: 1.1rem;
    }
`;

const ServerDescription = styled.p`
    font-size: 0.85rem;
    color: #A1A1AA;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const StatusBadge = styled.div<{ status: string }>`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 1rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    white-space: nowrap;

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
                    background: rgba(245, 158, 11, 0.12);
                    color: #F59E0B;
                `;
            case 'starting':
                return `
                    background: rgba(59, 130, 246, 0.12);
                    color: #3B82F6;
                `;
            default:
                return `
                    background: rgba(107, 114, 128, 0.12);
                    color: #6B7280;
                `;
        }
    }}
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;

    @media (max-width: 768px) {
        width: 100%;
        flex-wrap: wrap;
    }
`;

const ServerMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);

    @media (max-width: 768px) {
        display: none;
    }
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.7rem;
    color: #A1A1AA;

    svg {
        width: 14px;
        height: 14px;
        color: #6B7280;
    }

    span {
        color: #FFFFFF;
    }
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const ConsoleWrapper = styled.div`
    background: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    }
`;

const DetailsWrapper = styled.div`
    background: rgba(24, 24, 27, 0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 22px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        border-color: rgba(220, 38, 38, 0.3);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    }
`;

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const egg = ServerContext.useStoreState((state) => state.server.data!.egg);
    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((alloc) => alloc.isDefault);
        return !match ? 'n/a' : `${match.alias || match.ip}:${match.port}`;
    });

    const getStatusText = (): string => {
        if (isInstalling) return 'installing';
        if (isTransferring) return 'transferring';
        if (isNodeUnderMaintenance) return 'maintenance';
        return status || 'offline';
    };

    const statusText = getStatusText();

    return (
        <ServerContentBlock title={'Console'}>
            <PageContainer>
                {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                    <Alert type={'warning'} className={'mb-0'}>
                        {isNodeUnderMaintenance
                            ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                            : isInstalling
                            ? 'This server is currently running its installation process and most actions are unavailable.'
                            : 'This server is currently being transferred to another node and all actions are unavailable.'}
                    </Alert>
                )}

                <HeaderCard>
                    <HeaderLeft>
                        <ServerIconWrapper>
                            <FontAwesomeIcon icon={faServer} />
                        </ServerIconWrapper>
                        <ServerInfo>
                            <ServerName>{name}</ServerName>
                            {description && <ServerDescription>{description}</ServerDescription>}
                        </ServerInfo>
                        <StatusBadge status={statusText}>
                            <FontAwesomeIcon 
                                icon={statusText === 'running' ? faCircle : statusText === 'offline' ? faPowerOff : faTriangleExclamation} 
                            />
                            {statusText === 'running' ? 'Running' :
                             statusText === 'offline' ? 'Offline' :
                             statusText === 'installing' ? 'Installing' :
                             statusText === 'starting' ? 'Starting' :
                             statusText === 'transferring' ? 'Transferring' :
                             statusText === 'maintenance' ? 'Maintenance' :
                             statusText === 'restoring_backup' ? 'Restoring' :
                             'Unavailable'}
                        </StatusBadge>
                    </HeaderLeft>

                    <HeaderRight>
                        <ServerMeta>
                            <MetaItem>
                                <FontAwesomeIcon icon={faNetworkWired} />
                                <span>{allocation}</span>
                            </MetaItem>
                            <MetaItem>
                                <FontAwesomeIcon icon={faServer} />
                                <span>{node}</span>
                            </MetaItem>
                            <MetaItem>
                                <span>Egg: <span>{egg}</span></span>
                            </MetaItem>
                        </ServerMeta>
                        <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                            <PowerButtons />
                        </Can>
                    </HeaderRight>
                </HeaderCard>

                <ContentGrid>
                    <ConsoleWrapper>
                        <Spinner.Suspense>
                            <Console />
                        </Spinner.Suspense>
                    </ConsoleWrapper>

                    <DetailsWrapper>
                        <ServerDetailsBlock />
                    </DetailsWrapper>
                </ContentGrid>

                <div>
                    <Spinner.Suspense>
                        <StatGraphs />
                    </Spinner.Suspense>
                </div>

                <Features enabled={eggFeatures} />
            </PageContainer>
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);