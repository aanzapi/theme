// Pagination.tsx
import React from 'react';
import { PaginatedResult } from '@/api/http';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RenderFuncProps<T> {
    items: T[];
    isLastPage: boolean;
    isFirstPage: boolean;
}

interface Props<T> {
    data: PaginatedResult<T>;
    showGoToLast?: boolean;
    showGoToFirst?: boolean;
    onPageSelect: (page: number) => void;
    children: (props: RenderFuncProps<T>) => React.ReactNode;
}

function Pagination<T>({ data: { items, pagination }, onPageSelect, children }: Props<T>) {
    const isFirstPage = pagination.currentPage === 1;
    const isLastPage = pagination.currentPage >= pagination.totalPages;

    const pages = [];
    const start = Math.max(pagination.currentPage - 2, 1);
    const end = Math.min(pagination.totalPages, pagination.currentPage + 5);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return (
        <>
            {children({ items, isFirstPage, isLastPage })}
            {pages.length > 1 && (
                <div className="mt-6 flex items-center justify-center gap-1">
                    {pages[0] > 1 && !isFirstPage && (
                        <button
                            onClick={() => onPageSelect(1)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-blue-200/40 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <ChevronLeft className="w-4 h-4 -ml-2" />
                        </button>
                    )}
                    
                    {pages.map((i) => (
                        <button
                            key={`block_page_${i}`}
                            onClick={() => onPageSelect(i)}
                            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                pagination.currentPage === i
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-blue-200/60 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {i}
                        </button>
                    ))}
                    
                    {pages[pages.length - 1] < pagination.totalPages && !isLastPage && (
                        <button
                            onClick={() => onPageSelect(pagination.totalPages)}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-blue-200/40 hover:bg-white/10 hover:text-white transition-all duration-200"
                        >
                            <ChevronRight className="w-4 h-4" />
                            <ChevronRight className="w-4 h-4 -ml-2" />
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

export default Pagination;