
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Evento } from '../../types';
import logo from '../../assets/img/logo.png';

interface PublicEventListProps {
  eventos: Evento[];
}

const PublicEventList: React.FC<PublicEventListProps> = ({ eventos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Get unique locations for the filter
  const locations = Array.from(new Set(eventos.map(e => e.local))).sort();

  // Filter active events
  const activeEvents = eventos.filter(e => !e.encerrado);

  // Sort by date (nearest first)
  const sortedEvents = [...activeEvents].sort((a, b) => {
    const dateA = new Date(a.data).getTime();
    const dateB = new Date(b.data).getTime();
    return dateA - dateB;
  });

  // Filter logic
  const filteredEvents = sortedEvents.filter(evento => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      evento.nome.toLowerCase().includes(searchLower) ||
      evento.descricao.toLowerCase().includes(searchLower) ||
      evento.local.toLowerCase().includes(searchLower)
    );

    const matchesLocation = locationFilter === 'all' || evento.local === locationFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const eventDate = new Date(evento.data);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateFilter === 'today') {
        const eventDay = new Date(eventDate);
        eventDay.setHours(0, 0, 0, 0);
        matchesDate = eventDay.getTime() === today.getTime();
      } else if (dateFilter === 'week') {
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        matchesDate = eventDate >= today && eventDate <= nextWeek;
      } else if (dateFilter === 'month') {
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        matchesDate = eventDate >= today && eventDate <= nextMonth;
      }
    }

    return matchesSearch && matchesLocation && matchesDate;
  });

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: 'url(/hero-bg-v2.png)' }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Eventos UNINASSAU</h1>
          <p className="hero-subtitle">
            Confira a programação e confirme sua presença nos próximos eventos
          </p>
          <div className="hero-scroll-indicator">
            <span className="hero-scroll-text">
              Role para baixo para ver os eventos ativos e realizar sua inscrição
            </span>
            <span className="material-symbols-outlined text-3xl">expand_more</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 animate-in">
        {/* Search and Filters Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-grow w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Pesquisar eventos por nome, descrição ou local..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-400 shadow-sm"
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

          <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border-2 border-gray-100 shadow-sm flex-grow lg:flex-grow-0">
              <span className="material-symbols-outlined text-gray-400 ml-2 text-xl">calendar_month</span>
              <select
                className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 pr-8 cursor-pointer w-full lg:w-auto"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Todas as Datas</option>
                <option value="today">Hoje</option>
                <option value="week">Próximos 7 dias</option>
                <option value="month">Próximos 30 dias</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border-2 border-gray-100 shadow-sm flex-grow lg:flex-grow-0">
              <span className="material-symbols-outlined text-gray-400 ml-2 text-xl">location_on</span>
              <select
                className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 pr-8 cursor-pointer w-full lg:w-auto lg:max-w-[200px]"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">Todos os Locais</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || dateFilter !== 'all' || locationFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                  setLocationFilter('all');
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:bg-primary-light rounded-xl transition-all whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg">filter_alt_off</span>
                Limpar
              </button>
            )}
          </div>
        </div>

        {(searchTerm || dateFilter !== 'all' || locationFilter !== 'all') && (
          <p className="text-xs text-gray-500 font-medium pl-1 mb-6">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </p>
        )}

        {filteredEvents.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
            <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">
              {(searchTerm || dateFilter !== 'all' || locationFilter !== 'all') ? 'search_off' : 'calendar_today'}
            </span>
            <p className="text-gray-500 font-medium">
              {(searchTerm || dateFilter !== 'all' || locationFilter !== 'all')
                ? 'Nenhum evento corresponde aos filtros selecionados.'
                : 'Não há eventos disponíveis para inscrição no momento.'}
            </p>
            {(searchTerm || dateFilter !== 'all' || locationFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('all');
                  setLocationFilter('all');
                }}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map(evento => {
              const eventDate = new Date(evento.data);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();

              return (
                <div
                  key={evento.id}
                  className="event-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                >
                  {/* Event Image with Date Badge */}
                  <div className="relative w-full h-48 bg-primary/5 overflow-hidden flex items-center justify-center p-8">
                    <img
                      src={evento.imagem || logo}
                      alt={evento.nome}
                      className={evento.imagem ? "w-full h-full object-cover" : "max-w-full max-h-full object-contain opacity-90"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = logo;
                        (e.target as HTMLImageElement).className = "max-w-full max-h-full object-contain opacity-90";
                      }}
                    />
                    {/* Date Badge */}
                    <div className="date-badge">
                      <span className="date-badge-day">{day}</span>
                      <span className="date-badge-month">{month}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-grow p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2">
                      {evento.nome}
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                        <span className="font-semibold">{evento.horario}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                        <span className="font-semibold">{evento.local}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-6 pt-0">
                    <Link
                      to={`/evento/${evento.id}`}
                      className="block w-full bg-primary text-white px-6 py-3.5 rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all text-center"
                    >
                      Inscreva-se
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicEventList;
