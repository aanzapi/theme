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
import useSWR from 'swr';
import { PaginatedResult } from '@/api/http';
import Pagination from '@/components/elements/Pagination';
import { useLocation } from 'react-router-dom';
import { 
  Server as ServerIcon, 
  Cpu, 
  HardDrive, 
  MemoryStick,
  Sparkles
} from 'lucide-react';

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

    return (
        <PageContentBlock title={'Dashboard'} showFlashKey={'dashboard'}>
            {/* Welcome Hero */}
            <div className="mb-6 sm:mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-transparent p-5 sm:p-8 border border-blue-500/20">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-blue-500 rounded-full filter blur-3xl opacity-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                            <span className="text-[10px] sm:text-xs font-medium text-blue-400 uppercase tracking-wider">Dashboard</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Welcome Back</h1>
                        <p className="text-blue-200/60 text-sm sm:text-base">Manage your infrastructure efficiently and securely.</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-blue-200/60 mb-1">Total Servers</p>
                            <p className="text-xl sm:text-2xl font-bold text-white">{servers?.items.length || 0}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <ServerIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-blue-200/60 mb-1">CPU Usage</p>
                            <p className="text-xl sm:text-2xl font-bold text-white">23.5%</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-blue-200/60 mb-1">RAM Usage</p>
                            <p className="text-xl sm:text-2xl font-bold text-white">1.2 GB</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <MemoryStick className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-6 hover:border-blue-500/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-500"></div>
                    <div className="relative flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-blue-200/60 mb-1">Storage</p>
                            <p className="text-xl sm:text-2xl font-bold text-white">45.6 GB</p>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <HardDrive className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Server List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Your Servers</h2>
                    <p className="text-xs sm:text-sm text-blue-200/60">Manage and monitor your game servers</p>
                </div>
                {rootAdmin && (
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/10">
                        <span className="text-[10px] sm:text-xs text-blue-200/60 whitespace-nowrap">
                            {showOnlyAdmin ? "Showing others' servers" : 'Showing your servers'}
                        </span>
                        <Switch
                            name={'show_all_servers'}
                            defaultChecked={showOnlyAdmin}
                            onChange={() => setShowOnlyAdmin((s) => !s)}
                        />
                    </div>
                )}
            </div>

            {/* Server List */}
            <div className="space-y-3">
                {!servers ? (
                    <div className="flex justify-center py-12">
                        <Spinner centered size={'large'} />
                    </div>
                ) : (
                    <>
                        {servers.items.length > 0 ? (
                            servers.items.map((server) => (
                                <ServerRow key={server.uuid} server={server} />
                            ))
                        ) : (
                            <div className="text-center py-12 sm:py-16 bg-white/5 rounded-2xl border border-white/5">
                                <ServerIcon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400/30 mx-auto mb-3 sm:mb-4" />
                                <p className="text-blue-200/60 text-sm sm:text-base">
                                    {showOnlyAdmin
                                        ? 'There are no other servers to display.'
                                        : 'There are no servers associated with your account.'}
                                </p>
                            </div>
                        )}
                        
                        {servers.items.length > 0 && (
                            <div className="mt-4 sm:mt-6">
                                <Pagination data={servers} onPageSelect={setPage}>
                                    {({ items }) => null}
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </PageContentBlock>
    );
};