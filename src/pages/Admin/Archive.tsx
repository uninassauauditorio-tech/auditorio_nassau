
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Evento } from '../../types';

interface AdminArchiveProps {
    eventos: Evento[];
}

const AdminArchive: React.FC<AdminArchiveProps> = ({ eventos }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const archivedEventos = eventos.filter(e =>
        e.encerrado && e.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalEncerrados: eventos.filter(e => e.encerrado).length,
        totalInscritos: eventos.filter(e => e.encerrado).reduce((acc, e) => acc + e.inscritos.length, 0)
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-4 md:px-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link to="/admin" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-[10px] md:text-xs font-black uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar ao Painel
                        </Link>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl md:text-4xl text-gray-400">archive</span>
                        Arquivo de Eventos
                    </h2>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Histórico de eventos institucionais já encerrados.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
                <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 size-20 md:size-24 bg-gray-50 rounded-full group-hover:scale-110 transition-transform"></div>
                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Eventos Arquivados</p>
                    <p className="text-4xl md:text-5xl font-black text-gray-900 relative z-10">{stats.totalEncerrados}</p>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 size-20 md:size-24 bg-gray-50 rounded-full group-hover:scale-110 transition-transform"></div>
                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">Total de Participantes</p>
                    <p className="text-4xl md:text-5xl font-black text-gray-900 relative z-10">{stats.totalInscritos}</p>
                </div>
            </div>

            <div className="bg-white md:rounded-[2.5rem] shadow-sm border-y md:border border-gray-100 overflow-hidden">
                <div className="p-5 md:p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-lg md:text-xl font-black text-gray-900">Histórico de Eventos</h3>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Pesquisar no arquivo..."
                            className="pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-xl text-sm focus:ring-primary focus:border-primary w-full md:w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Identificação do Evento</th>
                                <th className="px-8 py-5">Data e Horário</th>
                                <th className="px-8 py-5">Registros</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Gerenciamento</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {archivedEventos.map(evento => (
                                <tr key={evento.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{evento.nome}</p>
                                        <p className="text-xs text-gray-400 font-medium">{evento.local}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-700">{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                                        <p className="text-xs text-gray-400">{evento.horario}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-black text-gray-500">
                                                {evento.inscritos.length}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-500">
                                            <span className="size-1.5 bg-gray-400 rounded-full"></span>
                                            Arquivado
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            to={`/admin/evento/${evento.id}`}
                                            className="bg-gray-100 text-gray-700 hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1"
                                        >
                                            VER REGISTROS
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {archivedEventos.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 grayscale opacity-40">
                                            <span className="material-symbols-outlined text-5xl">folder_open</span>
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Nenhum evento arquivado</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminArchive;
