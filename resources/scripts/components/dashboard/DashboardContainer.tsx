// DashboardContainer.tsx
import React, { useEffect, useState } from 'react';
import { Server } from '@/api/server/getServer';
import getServers from '@/api/getServers';
import ServerRow from '@/components/dashboard/ServerRow';
import Spinner from '@/components/elements/Spinner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { usePersistedState } from '@/plugins/usePersistedState';
import Switch from '@/components/elements/Switch';
import tw from 'twin.macro';
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Server as ServerIcon, Power, PowerOff, Cpu, HardDrive, MemoryStick } from 'lucide-react';

const PageWrapper = styled.div`
    background: #09090B;
    min-height: 100vh;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: 
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
        z-index: 0;
    }

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
            ellipse at 50% 0%,
            rgba(220, 38, 38, 0.08) 0%,
            transparent 70%
        );
        pointer-events: none;
        z-index: 0;
    }
`;

const ContentContainer = styled.div`
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }

    @media (max-width: 480px) {
        padding: 1rem;
    }
`;

const Header = styled.div`
    margin-bottom: 2.5rem;
`;

const HeaderTitle = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.02em;
    margin: 0;

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

const HeaderSubtitle = styled.p`
    font-size: 1rem;
    color: #A1A1AA;
    margin: 0.25rem 0 0;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 2.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const StatCard = styled.div`
    background: rgba(24, 24, 27, 0.80);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    }
`;

const StatHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
    font-size: 0.8rem;
    font-weight: 500;
    color: #A1A1AA;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const StatIcon = styled.div<{ color?: string }>`
    color: ${props => props.color || '#DC2626'};
    opacity: 0.7;

    svg {
        width: 20px;
        height: 20px;
    }
`;

const StatValue = styled.p<{ color?: string }>`
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.color || '#FFFFFF'};
    margin: 0;
    letter-spacing: -0.02em;

    @media (max-width: 480px) {
        font-size: 1.5rem;
    }
`;

const StatChange = styled.p`
    font-size: 0.75rem;
    color: #6B7280;
    margin: 0.25rem 0 0;
`;

const ServerSection = styled.div`
    margin-top: 2.5rem;
`;

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;

    @media (max-width: 480px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
`;

const SectionLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const SectionTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #FFFFFF;
    margin: 0;
    letter-spacing: -0.01em;
`;

const SectionSubtitle = styled.span`
    font-size: 0.85rem;
    color: #A1A1AA;
`;

const AdminToggle = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const ToggleLabel = styled.span`
    font-size: 0.75rem;
    font-weight: 500;
    color: #A1A1AA;
    text-transform: uppercase;
    letter-spacing: 0.02em;
`;

const ServersList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(24, 24, 27, 0.50);
    border-radius: 20px;
    border: 1px dashed rgba(255, 255, 255, 0.08);
`;

const EmptyIcon = styled.div`
    color: #6B7280;
    margin-bottom: 1rem;

    svg {
        width: 48px;
        height: 48px;
    }
`;

const EmptyTitle = styled.h3`
    font-size: 1.1rem;
    font-weight: 500;
    color: #FFFFFF;
    margin: 0 0 0.25rem;
`;

const EmptySubtitle = styled.p`
    font-size: 0.9rem;
    color: #6B7280;
    margin: 0;
`;

export default () => {
    const { search } = useLocation();
    const defaultPage = Number(new URLSearchParams(search).get('page') || '1');

    const [page, setPage] = useState(!isNaN(defaultPage) && defaultPage > 0 ? defaultPage : 1);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const uuid = useStoreState((state) => state.user.data!.uuid);
    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const [showOnlyAdmin, setShowOnlyAdmin] = usePersistedState(`${uuid}:show_all_servers`, false);

    const { data: servers, error } = useSWR<PaginatedResult<Server>>(
        ['/api/client/servers', showOnlyAdmin && rootAdmin, page],
        () => getServers({ page, type: showOnlyAdmin && rootAdmin ? 'admin' : undefined })
    );

    useEffect(() => {
        setPage(1);
    }, [showOnlyAdmin]);

    useEffect(() => {
        if (!servers) return;
        if (servers.pagination.currentPage > 1 && !servers.items.length) {
            setPage(1);
        }
    }, [servers?.pagination.currentPage]);

    useEffect(() => {
        window.history.replaceState(null, document.title, `/${page <= 1 ? '' : `?page=${page}`}`);
    }, [page]);

    useEffect(() => {
        if (error) clearAndAddHttpError({ key: 'dashboard', error });
        if (!error) clearFlashes('dashboard');
    }, [error]);

    const totalServers = servers?.pagination.total || 0;
    const runningServers = servers?.items.filter(s => s.status === 'running').length || 0;
    const offlineServers = servers?.items.filter(s => s.status === 'offline' || !s.status).length || 0;

    return (
        <PageWrapper>
            <ContentContainer>
                <Header>
                    <HeaderTitle>Welcome Back</HeaderTitle>
                    <HeaderSubtitle>Manage all your servers in one place.</HeaderSubtitle>
                </Header>

                <StatsGrid>
                    <StatCard>
                        <StatHeader>
                            <StatLabel>Total Servers</StatLabel>
                            <StatIcon><ServerIcon /></StatIcon>
                        </StatHeader>
                        <StatValue>{totalServers}</StatValue>
                        <StatChange>Active servers in your account</StatChange>
                    </StatCard>

                    <StatCard>
                        <StatHeader>
                            <StatLabel>Running</StatLabel>
                            <StatIcon color="#22C55E"><Power /></StatIcon>
                        </StatHeader>
                        <StatValue color="#22C55E">{runningServers}</StatValue>
                        <StatChange>Servers currently online</StatChange>
                    </StatCard>

                    <StatCard>
                        <StatHeader>
                            <StatLabel>Offline</StatLabel>
                            <StatIcon color="#EF4444"><PowerOff /></StatIcon>
                        </StatHeader>
                        <StatValue color="#EF4444">{offlineServers}</StatValue>
                        <StatChange>Servers currently offline</StatChange>
                    </StatCard>

                    <StatCard>
                        <StatHeader>
                            <StatLabel>Resources</StatLabel>
                            <StatIcon color="#F59E0B"><Cpu /></StatIcon>
                        </StatHeader>
                        <StatValue color="#F59E0B">-</StatValue>
                        <StatChange>CPU / RAM / Disk usage</StatChange>
                    </StatCard>
                </StatsGrid>

                <ServerSection>
                    <SectionHeader>
                        <SectionLeft>
                            <SectionTitle>My Servers</SectionTitle>
                            <SectionSubtitle>All servers linked to your account</SectionSubtitle>
                        </SectionLeft>
                        {rootAdmin && (
                            <AdminToggle>
                                <ToggleLabel>
                                    {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                                </ToggleLabel>
                                <Switch
                                    name={'show_all_servers'}
                                    defaultChecked={showOnlyAdmin}
                                    onChange={() => setShowOnlyAdmin((s) => !s)}
                                />
                            </AdminToggle>
                        )}
                    </SectionHeader>

                    {!servers ? (
                        <Spinner centered size={'large'} />
                    ) : (
                        <Pagination data={servers} onPageSelect={setPage}>
                            {({ items }) =>
                                items.length > 0 ? (
                                    <ServersList>
                                        {items.map((server) => (
                                            <ServerRow key={server.uuid} server={server} />
                                        ))}
                                    </ServersList>
                                ) : (
                                    <EmptyState>
                                        <EmptyIcon><ServerIcon /></EmptyIcon>
                                        <EmptyTitle>No Servers Found</EmptyTitle>
                                        <EmptySubtitle>
                                            {showOnlyAdmin
                                                ? 'There are no other servers to display.'
                                                : 'There are no servers associated with your account.'}
                                        </EmptySubtitle>
                                    </EmptyState>
                                )
                            }
                        </Pagination>
                    )}
                </ServerSection>
            </ContentContainer>
        </PageWrapper>
    );
};