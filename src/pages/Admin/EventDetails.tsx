
import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Evento, Inscrito } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { exportToXLSX } from '../../utils/export';
import { generateReceipt, generateEventRedirectQRCode } from '../../utils/receipt';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AlertDialog from '../../components/ui/AlertDialog';

interface AdminEventDetailsProps {
  eventos: Evento[];
  onEnd: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteRegistration: (id: string) => Promise<void>;
  onCheckin: (token: string) => Promise<{ success: boolean; message: string }>;
}

const AdminEventDetails: React.FC<AdminEventDetailsProps> = ({ eventos, onEnd, onDelete, onDeleteRegistration, onCheckin }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const evento = eventos.find(e => e.id === id);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'pending'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deletePassword, setDeletePassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Modal States
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'info'
  });

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const filteredInscritos = useMemo(() => {
    if (!evento) return [];

    let result = [...evento.inscritos];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(i =>
        i.nomeCompleto.toLowerCase().includes(term) ||
        (i.cpf && i.cpf.includes(term)) ||
        (i.email && i.email.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (statusFilter === 'present') {
      result = result.filter(i => i.checkedIn);
    } else if (statusFilter === 'pending') {
      result = result.filter(i => !i.checkedIn);
    }

    // Sort
    result.sort((a, b) => {
      const nameA = a.nomeCompleto.toLowerCase();
      const nameB = b.nomeCompleto.toLowerCase();
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return result;
  }, [evento, searchTerm, statusFilter, sortOrder]);

  if (!evento) {
    return <div className="text-center py-20 font-bold text-gray-400">Evento institucional não localizado.</div>;
  }

  const handleEncerrar = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Encerrar Evento',
      message: 'CONFIRMAÇÃO: Encerrar o registro de presença? Ninguém mais poderá confirmar participação online.',
      onConfirm: () => onEnd(evento.id),
      type: 'warning'
    });
  };

  const handleDelete = () => {
    setDeletePassword('');
    setPasswordError(false);
    setConfirmConfig({
      isOpen: true,
      title: 'Excluir Evento',
      message: `ATENÇÃO: Esta ação é IRREVERSÍVEL!\n\nDeseja realmente excluir o evento "${evento.nome}"?\n\nTodos os registros de participantes também serão excluídos.\n\nDIGITE A SENHA DE SEGURANÇA PARA PROSSEGUIR:`,
      onConfirm: () => {
        // Validation happens inside the component handle or here? 
        // Let's handle it in the component and only call deletion if password is correct.
      },
      type: 'danger'
    });
  };

  const handleConfirmDelete = () => {
    const MASTER_PASSWORD = '240686';
    if (deletePassword === MASTER_PASSWORD) {
      onDelete(evento?.id || '');
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      navigate('/admin');
    } else {
      setPasswordError(true);
      setAlertConfig({
        isOpen: true,
        title: 'Senha Incorreta',
        message: 'A senha digitada está incorreta. A exclusão foi cancelada.',
        type: 'error'
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const headers = ["Nome Completo", "CPF", "Telefone", "E-mail", "Escolaridade", "Interesse/Tipo", "Curso Interesse", "Data/Hora Registro", "Presença", "Data/Hora Check-in"];
    const rows = evento.inscritos.map(i => [
      i.nomeCompleto,
      i.cpf,
      i.telefone,
      i.email,
      i.escolaridade,
      i.interesseGraduacao || i.interesseTipo || 'N/A',
      i.cursoInteresse || 'N/A',
      new Date(i.dataInscricao).toLocaleString('pt-BR'),
      i.checkedIn ? 'SIM' : 'NÃO',
      i.checkinDate ? new Date(i.checkinDate).toLocaleString('pt-BR') : 'N/A'
    ]);

    exportToXLSX(rows, headers, `LISTA_AUDITORIO_${evento.nome.toUpperCase().replace(/\s/g, '_')}`);
  };

  const columns: Column<Inscrito>[] = [
    {
      header: 'Participante',
      accessor: (item) => (
        <div className="min-w-[120px]">
          <p className="font-bold text-gray-900 text-xs">{item.nomeCompleto.toUpperCase()}</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter leading-tight">{item.escolaridade}</p>
        </div>
      ),
      sortable: true
    },
    {
      header: 'CPF',
      accessor: 'cpf',
      className: 'text-[11px] font-bold text-gray-700 min-w-[100px]'
    },
    {
      header: 'Contato',
      accessor: (item) => (
        <div className="min-w-[140px]">
          <p className="text-[10px] text-gray-400 truncate">{item.email}</p>
          <p className="text-[10px] text-gray-400">{item.telefone}</p>
        </div>
      )
    },
    {
      header: 'Interesse',
      accessor: (item) => item.cursoInteresse ? (
        <div className="bg-primary/5 p-1.5 rounded-lg inline-block border border-primary/10 max-w-[150px]">
          <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none mb-1">Curso:</p>
          <p className="text-[10px] font-bold text-gray-800 leading-tight">{item.cursoInteresse}</p>
        </div>
      ) : (
        <span className="text-[10px] text-gray-300 font-bold italic">Nenhum</span>
      )
    },
    {
      header: 'Data Registro',
      accessor: (item) => (
        <div className="text-center min-w-[80px]">
          <p className="text-[10px] font-bold text-gray-500">
            {new Date(item.dataInscricao).toLocaleDateString('pt-BR')}
          </p>
          <p className="text-[9px] text-gray-400">
            {new Date(item.dataInscricao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ),
      className: 'text-center',
      sortable: true
    },
    {
      header: 'Presença',
      accessor: (item) => (
        <div className="text-center min-w-[100px]">
          {item.checkedIn ? (
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-600 border border-green-200">
                <span className="material-symbols-outlined text-[12px]">check_circle</span>
                PRESENTE
              </span>
              {item.checkinDate && (
                <p className="text-[8px] text-gray-400 font-bold mt-1">
                  {new Date(item.checkinDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-400 border border-gray-200">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              PENDENTE
            </span>
          )}
        </div>
      ),
      className: 'text-center',
      sortable: true
    },
    {
      header: 'Ações',
      accessor: (item) => (
        <div className="flex justify-center gap-2 no-print">
          {!item.checkedIn ? (
            <button
              onClick={async () => {
                setConfirmConfig({
                  isOpen: true,
                  title: 'Confirmar Presença',
                  message: `Confirmar presença manual para ${item.nomeCompleto.toUpperCase()}?`,
                  onConfirm: async () => {
                    const result = await onCheckin(item.qrToken);
                    if (!result.success) {
                      setAlertConfig({
                        isOpen: true,
                        title: 'Erro no Check-in',
                        message: result.message,
                        type: 'error'
                      });
                    }
                  },
                  type: 'info'
                });
              }}
              className="bg-primary text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
              Confirmar
            </button>
          ) : (
            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              Validado
            </span>
          )}

          <button
            onClick={() => generateReceipt(evento, item)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 shadow-sm ${item.checkedIn
              ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
              : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            title={item.checkedIn ? "Gerar Certificado de Presença" : "Reimprimir Comprovante de Inscrição"}
          >
            <span className="material-symbols-outlined text-[14px]">{item.checkedIn ? 'verified' : 'print'}</span>
            {item.checkedIn ? 'Certificado' : 'Recibo'}
          </button>

          <button
            onClick={async () => {
              setConfirmConfig({
                isOpen: true,
                title: 'Excluir Participante',
                message: `ATENÇÃO: Deseja realmente excluir o registro de ${item.nomeCompleto.toUpperCase()}?\n\nEsta ação não pode ser desfeita.`,
                onConfirm: async () => {
                  try {
                    await onDeleteRegistration(item.id);
                  } catch (e) {
                    setAlertConfig({
                      isOpen: true,
                      title: 'Erro ao Excluir',
                      message: 'Erro ao excluir participante. Tente novamente.',
                      type: 'error'
                    });
                  }
                },
                type: 'danger'
              });
            }}
            className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-1 shadow-sm"
            title="Excluir Participante"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      ),
      className: 'text-center'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 no-print px-4 md:px-0">
        <Link to="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-black uppercase tracking-tighter">
          <span className="material-symbols-outlined font-bold">arrow_back</span>
          Painel do Auditório
        </Link>

        <div className="grid grid-cols-2 sm:flex gap-3">
          <Link
            to={`/admin/evento/${evento.id}/editar`}
            className="bg-white border-2 border-primary text-primary px-4 md:px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar
          </Link>
          <button
            onClick={handlePrint}
            className="bg-white border-2 border-gray-100 text-gray-700 px-4 md:px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            Imprimir
          </button>
          {!evento.encerrado && (
            <button
              onClick={handleEncerrar}
              className="col-span-2 sm:col-auto bg-red-50 text-red-600 border-2 border-red-50 px-4 md:px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
            >
              Encerrar Evento
            </button>
          )}
          <button
            onClick={() => generateEventRedirectQRCode(evento)}
            className="col-span-2 sm:col-auto bg-primary text-white border-2 border-primary px-4 md:px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-lg">qr_code_2</span>
            QR Inscrição
          </button>
          <button
            onClick={handleDelete}
            className="col-span-2 sm:col-auto bg-red-600 text-white border-2 border-red-600 px-4 md:px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar info */}
        <div className="lg:col-span-1 space-y-6 no-print px-4 md:px-0">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="mb-6 flex items-center gap-2">
              <span className={`inline-block size-3 rounded-full ${evento.encerrado ? 'bg-red-500' : 'bg-green-500'}`}></span>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${evento.encerrado ? 'text-red-500' : 'text-green-500'}`}>
                {evento.encerrado ? 'REGISTRO ENCERRADO' : 'INSCRIÇÕES ABERTAS'}
              </span>
            </div>

            <div className="mb-6">
              {evento.tipo === 'externo' ? (
                <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-purple-100 flex items-center gap-2 w-fit">
                  <span className="material-symbols-outlined text-sm">public</span>
                  Evento Externo
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100 flex items-center gap-2 w-fit">
                  <span className="material-symbols-outlined text-sm">school</span>
                  Evento Interno
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight tracking-tight">{evento.nome}</h2>

            <div className="space-y-5 border-t border-gray-50 pt-6">
              <div className="flex gap-4">
                <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Programada</p>
                  <p className="text-sm font-bold text-gray-800">{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-400">schedule</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horário Previsto</p>
                  <p className="text-sm font-bold text-gray-800">{evento.horario}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-400">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Localização</p>
                  <p className="text-sm font-bold text-gray-800">{evento.local}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary p-6 md:p-8 rounded-[2rem] shadow-xl shadow-primary/20 text-white relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-7xl md:text-9xl group-hover:scale-110 transition-transform">group</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary-light/70 mb-1">Presenças Confirmadas</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl md:text-6xl font-black">{evento.inscritos.filter(i => i.checkedIn).length}</p>
              <p className="text-lg md:text-xl font-bold text-primary-light/60">/ {evento.inscritos.length}</p>
            </div>
            <p className="text-[9px] font-bold text-primary-light/50 mt-2 uppercase tracking-tighter">
              {((evento.inscritos.filter(i => i.checkedIn).length / (evento.inscritos.length || 1)) * 100).toFixed(0)}% de comparecimento
            </p>
          </div>
        </div>

        {/* List of Subscribers */}
        <div className="lg:col-span-2 space-y-6 w-full print:w-full px-4 md:px-0">
          <div className="bg-white md:rounded-[2.5rem] shadow-sm border-y md:border border-gray-100 overflow-hidden">
            <div className="p-5 md:p-8 border-b flex flex-col gap-6 no-print">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg md:text-xl font-black text-gray-900">Participantes Registrados</h3>
                {evento.inscritos.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 w-full sm:w-auto"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    Exportar Excel
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                  <input
                    type="text"
                    placeholder="Buscar por nome, CPF ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="present">Presentes</option>
                    <option value="pending">Pendentes</option>
                  </select>

                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {sortOrder === 'asc' ? 'sort_by_alpha' : 'sort_by_alpha'}
                    </span>
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                  </button>
                </div>
              </div>
            </div>

            {/* Print Header */}
            <div className="hidden print-only p-10 border-b-2 border-gray-200 text-center mb-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-black text-primary">UNINASSAU</h1>
                  {evento.imagem && (
                    <img src={evento.imagem} alt="" className="h-12 w-auto rounded object-contain" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lista de Presença Oficial</p>
                  <p className="text-xs font-bold">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase mb-2">{evento.nome}</h2>
              <div className="flex justify-center gap-6 text-sm font-bold text-gray-600">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_month</span> {new Date(evento.data).toLocaleDateString('pt-BR')}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {evento.horario}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">location_on</span> {evento.local}</span>
              </div>
            </div>

            <Table
              data={filteredInscritos}
              columns={columns}
              keyExtractor={(item) => item.id}
              emptyMessage={searchTerm || statusFilter !== 'all' ? "Nenhum participante encontrado com esses filtros." : "Aguardando primeiros registros"}
            />

            <div className="hidden print-only p-20 mt-20 border-t-0">
              <div className="flex justify-between gap-12">
                <div className="flex-1 border-t border-gray-900 pt-2 text-center">
                  <p className="text-xs font-bold uppercase">Responsável pelo Evento</p>
                </div>
                <div className="flex-1 border-t border-gray-900 pt-2 text-center">
                  <p className="text-xs font-bold uppercase">Coordenação UNINASSAU</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => {
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          setDeletePassword('');
          setPasswordError(false);
        }}
        onConfirm={confirmConfig.title === 'Excluir Evento' ? handleConfirmDelete : confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      >
        {confirmConfig.title === 'Excluir Evento' && (
          <div className="mt-4 w-full px-8">
            <input
              type="password"
              placeholder="Senha de segurança"
              value={deletePassword}
              onChange={(e) => {
                setDeletePassword(e.target.value);
                setPasswordError(false);
              }}
              className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl text-center text-lg font-black tracking-[0.5em] focus:outline-none focus:ring-2 transition-all ${passwordError ? 'border-red-500 focus:ring-red-200' : 'border-gray-100 focus:ring-primary/20 focus:border-primary'
                }`}
              autoFocus
            />
            {passwordError && <p className="text-red-500 text-[10px] font-black mt-2 uppercase">Senha incorreta!</p>}
          </div>
        )}
      </ConfirmDialog>

      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default AdminEventDetails;
