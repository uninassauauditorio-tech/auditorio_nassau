import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Evento, Escolaridade, Inscrito } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { RadioGroup } from '../../components/ui/RadioGroup';
import { jsPDF } from 'jspdf';

interface PublicEventRegistrationProps {
  eventos: Evento[];
  onRegister: (eventoId: string, inscrito: Omit<Inscrito, 'id' | 'dataInscricao'>) => void;
}

const COURSES = [
  "ADMINISTRAÇÃO",
  "ANÁLISE E DESENVOLVIMENTO DE SISTEMAS",
  "CIÊNCIA DA COMPUTAÇÃO",
  "CIÊNCIAS CONTÁBEIS",
  "DIREITO",
  "ENFERMAGEM",
  "FARMÁCIA",
  "FISIOTERAPIA",
  "NUTRIÇÃO",
  "ODONTOLOGIA",
  "PSICOLOGIA",
  "SISTEMAS DE INFORMAÇÃO",
  "TERAPIA OCUPACIONAL"
];

const PublicEventRegistration: React.FC<PublicEventRegistrationProps> = ({ eventos, onRegister }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const evento = eventos.find(e => e.id === id);

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    telefone: '',
    cpf: '',
    email: '',
    escolaridade: '',
    interesseGraduacao: '',
    interesseTipo: '',
    cursoInteresse: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Helper Functions para Máscaras
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showGradInterest =
    formData.escolaridade === Escolaridade.MEDIO_COMPLETO ||
    formData.escolaridade === Escolaridade.MEDIO_ANDAMENTO;

  const showHigherInterest =
    formData.escolaridade === Escolaridade.SUPERIOR_COMPLETO;

  const showCourseField =
    (showGradInterest && formData.interesseGraduacao === 'Sim') ||
    (showHigherInterest && formData.interesseTipo === 'Segunda Graduação');

  const isFormValid =
    formData.nomeCompleto.trim().length >= 3 &&
    formData.telefone.length === 15 &&
    formData.cpf.length === 14 &&
    validateEmail(formData.email) &&
    formData.escolaridade !== '' &&
    (!showGradInterest || formData.interesseGraduacao !== '') &&
    (!showHigherInterest || formData.interesseTipo !== '') &&
    (!showCourseField || formData.cursoInteresse !== '');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      interesseGraduacao: '',
      interesseTipo: '',
      cursoInteresse: ''
    }));
  }, [formData.escolaridade]);

  if (!evento || evento.encerrado) {
    return (
      <div className="max-w-md mx-auto text-center py-32 animate-in">
        <div className="size-20 bg-gray-100 text-gray-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">event_busy</span>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Evento Não Disponível</h2>
        <p className="text-gray-500 mb-8 px-4">Este evento já foi encerrado ou não permite novas confirmações de presença.</p>
        <Link to="/" className="bg-primary text-white px-8 py-3 rounded-2xl font-black hover:bg-primary-dark transition-all inline-block shadow-lg shadow-primary/20">
          Ver Outros Eventos
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload: any = {
      nomeCompleto: formData.nomeCompleto,
      telefone: formData.telefone,
      cpf: formData.cpf,
      email: formData.email,
      escolaridade: formData.escolaridade,
    };

    if (formData.interesseGraduacao) payload.interesseGraduacao = formData.interesseGraduacao;
    if (formData.interesseTipo) payload.interesseTipo = formData.interesseTipo;

    // Se for pós-graduação, o curso de interesse é a própria pós
    if (formData.interesseTipo === 'Pós-graduação') {
      payload.cursoInteresse = 'Pós-graduação';
    } else if (formData.cursoInteresse) {
      payload.cursoInteresse = formData.cursoInteresse;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onRegister(evento.id, payload);
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 800);
  };

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    const primaryColor = '#004a99';
    const secondaryColor = '#333333';
    const lightGray = '#f3f4f6';

    doc.setDrawColor(primaryColor);
    doc.setLineWidth(1);
    doc.roundedRect(10, 10, 128, 190, 5, 5, 'D');

    doc.setFillColor(primaryColor);
    doc.rect(10, 10, 128, 25, 'F');
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('UNINASSAU', 74, 22, { align: 'center' });
    doc.setFontSize(10);
    doc.text('COMPROVANTE DE INSCRIÇÃO', 74, 30, { align: 'center' });

    doc.setTextColor(secondaryColor);
    let y = 50;

    const addField = (label: string, value: string) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor('#999999');
      doc.text(label.toUpperCase(), 20, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(secondaryColor);
      doc.text(value, 20, y);
      y += 12;
    };

    addField('Participante', formData.nomeCompleto.toUpperCase());
    addField('CPF', formData.cpf);
    addField('Evento', evento.nome);
    addField('Data do Evento', `${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario}`);
    addField('Local', evento.local);

    doc.setFillColor(lightGray);
    doc.roundedRect(49, 145, 50, 20, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor('#666666');
    doc.text('VALIDADO PELO SISTEMA', 74, 157, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor('#999999');
    doc.text('Apresente este comprovante na portaria do auditório.', 74, 185, { align: 'center' });
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 74, 192, { align: 'center' });

    doc.save(`comprovante-${formData.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    setIsDownloaded(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-6 md:py-12 animate-in px-4">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-primary/5 text-center relative border border-gray-100 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
          <div className="size-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <span className="material-symbols-outlined text-5xl font-black">check_circle</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Presença Confirmada!</h2>
          <p className="text-gray-500 mb-10 text-lg">Sua participação foi registrada com sucesso no sistema institucional.</p>
          <div className="bg-gray-50 p-6 rounded-3xl text-left border border-gray-100 mb-10 space-y-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Participante</p>
              <p className="text-lg font-bold text-gray-800">{formData.nomeCompleto.toUpperCase()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPF</p>
                <p className="text-sm font-bold text-gray-700">{formData.cpf}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Evento</p>
                <p className="text-sm font-bold text-gray-700">{evento.nome}</p>
              </div>
            </div>
          </div>

          {!isDownloaded && (
            <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3 animate-pulse no-print">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <p className="text-xs text-amber-800 font-bold text-left">
                ATENÇÃO: Você deve baixar seu comprovante para liberar o botão de conclusão. Ele será exigido na portaria.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 no-print ${isDownloaded
                ? 'bg-gray-50 text-gray-400 border-2 border-gray-100'
                : 'bg-white border-2 border-primary text-primary hover:bg-primary-light'
                }`}
            >
              <span className="material-symbols-outlined">{isDownloaded ? 'check' : 'download'}</span>
              {isDownloaded ? 'Comprovante Baixado' : 'Baixar Comprovante'}
            </button>
            <button
              onClick={() => isDownloaded && navigate('/')}
              disabled={!isDownloaded}
              className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all shadow-lg no-print ${isDownloaded
                ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
              Concluir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="max-w-6xl mx-auto animate-in">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-10 text-sm font-black uppercase tracking-tighter no-print">
          <span className="material-symbols-outlined font-bold">arrow_back</span>
          Programação do Auditório
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100">
              {/* Event Image */}
              {evento.imagem && (
                <div className="mb-8 -mx-6 md:-mx-10 -mt-6 md:-mt-10">
                  <img
                    src={evento.imagem}
                    alt={evento.nome}
                    className="w-full h-64 md:h-80 object-cover rounded-t-[2rem] md:rounded-t-[3rem]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-primary-light text-primary mb-6">
                Evento Institucional
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">{evento.nome}</h2>
              <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10">{evento.descricao}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:grid-cols-2 md:gap-6">
                <div className="flex items-center gap-5 p-6 bg-secondary/50 rounded-[2rem] border border-gray-100/50">
                  <div className="size-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">event</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quando</p>
                    <p className="text-base font-black text-gray-800">{new Date(evento.data).toLocaleDateString('pt-BR')}</p>
                    <p className="text-xs font-bold text-gray-500">{evento.horario}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-secondary/50 rounded-[2rem] border border-gray-100/50">
                  <div className="size-14 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">meeting_room</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Onde</p>
                    <p className="text-base font-black text-gray-800">{evento.local}</p>
                    <p className="text-xs font-bold text-gray-500">Auditório UNINASSAU</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-primary/5 border border-gray-100 lg:sticky lg:top-24">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-lg">edit_note</span>
                </div>
                Confirmar Presença
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Nome Completo"
                  placeholder="Seu nome completo"
                  value={formData.nomeCompleto}
                  onChange={e => setFormData({ ...formData, nomeCompleto: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Telefone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={e => setFormData({ ...formData, telefone: maskPhone(e.target.value) })}
                    required
                  />
                  <Input
                    label="CPF"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={e => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                    required
                  />
                </div>

                <Input
                  label="E-mail"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value.toLowerCase().trim() })}
                  error={formData.email && !validateEmail(formData.email) ? "Formato de e-mail inválido." : undefined}
                  required
                />

                <Select
                  label="Escolaridade Atual"
                  placeholder="Selecione uma opção..."
                  value={formData.escolaridade}
                  onChange={e => setFormData({ ...formData, escolaridade: e.target.value })}
                  options={Object.values(Escolaridade).map(esc => ({ value: esc, label: esc }))}
                  required
                />

                {showGradInterest && (
                  <RadioGroup
                    label="Você tem interesse em cursar uma graduação?"
                    name="interesseGraduacao"
                    options={['Sim', 'Não']}
                    value={formData.interesseGraduacao}
                    onChange={val => setFormData({ ...formData, interesseGraduacao: val })}
                    required
                  />
                )}

                {showHigherInterest && (
                  <RadioGroup
                    label="Você tem interesse em:"
                    name="interesseTipo"
                    options={['Segunda Graduação', 'Pós-graduação', 'Não tenho interesse no momento']}
                    value={formData.interesseTipo}
                    onChange={val => setFormData({ ...formData, interesseTipo: val })}
                    required
                  />
                )}

                {showCourseField && (
                  <Select
                    label="Qual curso você tem interesse?"
                    placeholder="Selecione o curso..."
                    value={formData.cursoInteresse}
                    onChange={e => setFormData({ ...formData, cursoInteresse: e.target.value })}
                    options={COURSES.map(course => ({ value: course, label: course }))}
                    required
                  />
                )}

                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  isLoading={isSubmitting}
                  fullWidth
                  variant={!isFormValid || isSubmitting ? 'secondary' : 'primary'}
                  icon={isFormValid && !isSubmitting ? 'arrow_forward' : undefined}
                  className={!isFormValid || isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none border-none' : ''}
                >
                  {isFormValid ? 'CONFIRMAR MINHA VAGA' : 'COMPLETE OS CAMPOS CORRETAMENTE'}
                </Button>

                <div className="flex gap-2 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50 mt-6">
                  <span className="material-symbols-outlined text-primary text-lg">info</span>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    Ao confirmar, seus dados serão compartilhados com a organização para controle de presença e contato institucional.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicEventRegistration;
