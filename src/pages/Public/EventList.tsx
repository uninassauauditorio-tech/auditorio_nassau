
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Evento } from '../../types';

interface PublicEventListProps {
  eventos: Evento[];
}

const PublicEventList: React.FC<PublicEventListProps> = ({ eventos }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter active events
  const activeEvents = eventos.filter(e => !e.encerrado);

  // Sort by date (nearest first)
  const sortedEvents = [...activeEvents].sort((a, b) => {
    const dateA = new Date(a.data).getTime();
    const dateB = new Date(b.data).getTime();
    return dateA - dateB;
  });

  // Filter by search term
  const filteredEvents = sortedEvents.filter(evento => {
    const searchLower = searchTerm.toLowerCase();
    return (
      evento.nome.toLowerCase().includes(searchLower) ||
      evento.descricao.toLowerCase().includes(searchLower) ||
      evento.local.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-institutional min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto py-8 px-4 animate-in">
        {/* Header Section with Better Visibility */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/30 mb-10">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">Eventos UNINASSAU</h2>
          <p className="text-gray-800 text-lg font-semibold">Confira a programação e confirme sua presença nos próximos eventos.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Pesquisar eventos por nome, descrição ou local..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="mt-2 text-xs text-gray-500 font-medium">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
            </p>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
            <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">{searchTerm ? 'search_off' : 'calendar_today'}</span>
            <p className="text-gray-500 font-medium">
              {searchTerm
                ? `Nenhum evento encontrado para "${searchTerm}"`
                : 'Não há eventos disponíveis para inscrição no momento.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Limpar pesquisa
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map(evento => (
              <div
                key={evento.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Event Image */}
                <div className="w-full md:w-48 lg:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-gray-100">
                  <img
                    src={evento.imagem || 'https://placehold.co/600x400/004a99/ffffff?text=UNINASSAU+EVENTOS'}
                    alt={evento.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/004a99/ffffff?text=UNINASSAU+EVENTOS';
                    }}
                  />
                  {!evento.imagem && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="material-symbols-outlined text-6xl">event</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow p-5 md:p-8">
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
                      Inscrições Abertas
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3">
                    {evento.nome}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
                    {evento.descricao}
                  </p>

                  <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl font-icon">calendar_month</span>
                      <span className="font-semibold">{new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl font-icon">schedule</span>
                      <span className="font-semibold">{evento.horario}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl font-icon">location_on</span>
                      <span className="font-semibold">{evento.local}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center p-8 border-t md:border-t-0 md:border-l border-gray-100 min-w-[200px]">
                  <Link
                    to={`/evento/${evento.id}`}
                    className="w-full md:w-auto bg-primary text-white px-10 py-3.5 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all text-center"
                  >
                    Participar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEventList;
