
import React from 'react';
import { Link } from 'react-router-dom';
import { Evento } from '../../types';

interface PublicEventListProps {
  eventos: Evento[];
}

const PublicEventList: React.FC<PublicEventListProps> = ({ eventos }) => {
  const activeEvents = eventos.filter(e => !e.encerrado);

  return (
    <div className="max-w-5xl mx-auto animate-in">
      <div className="mb-10">
        <h2 className="text-4xl font-black text-gray-900 mb-2">Eventos no Auditório</h2>
        <p className="text-gray-600">Confira a programação e confirme sua presença nos próximos eventos.</p>
      </div>

      {activeEvents.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm text-center border-2 border-dashed border-gray-200">
          <span className="material-symbols-outlined text-gray-300 text-6xl mb-4">calendar_today</span>
          <p className="text-gray-500 font-medium">Não há eventos disponíveis para inscrição no momento.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeEvents.map(evento => (
            <div
              key={evento.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row"
            >
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
  );
};

export default PublicEventList;
