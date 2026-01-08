import React, { useState } from 'react';

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    sortable?: boolean;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
}

export const Table = <T,>({ data, columns, keyExtractor, emptyMessage = "Nenhum registro encontrado." }: TableProps<T>) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            // @ts-ignore
            const aValue = a[sortConfig.key];
            // @ts-ignore
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    if (data.length === 0) {
        return (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
                <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">table_view</span>
                <p className="text-gray-500 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead className="bg-gray-50/50 text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em]">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`px-3 md:px-8 py-4 md:py-5 ${col.sortable ? 'cursor-pointer hover:text-primary transition-colors' : ''} ${col.className || ''}`}
                                    onClick={() => col.sortable && typeof col.accessor === 'string' && handleSort(col.accessor as string)}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.header}
                                        {sortConfig && sortConfig.key === col.accessor && (
                                            <span className="material-symbols-outlined text-sm">
                                                {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedData.map((item) => (
                            <tr key={keyExtractor(item)} className="hover:bg-gray-50/50 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className={`px-3 md:px-8 py-4 md:py-6 ${col.className || ''}`}>
                                        <div className="break-words">
                                            {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as any)}
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
