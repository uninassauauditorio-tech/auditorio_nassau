
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Evento } from '../../types';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

interface AdminEventFormProps {
  onSave: (evento: any) => void;
  initialData?: Evento;
}

const AdminEventForm: React.FC<AdminEventFormProps> = ({ onSave, initialData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    data: '',
    horario: '',
    descricao: '',
    local: 'Auditório UNINASSAU Olinda'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome,
        data: initialData.data,
        horario: initialData.horario,
        descricao: initialData.descricao,
        local: initialData.local
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSave({ ...initialData, ...formData });
    } else {
      onSave(formData);
    }
    navigate('/admin');
  };

  return (
    <div className="max-w-3xl mx-auto animate-in">
      <div className="mb-6">
        <Link to={initialData ? `/admin/evento/${initialData.id}` : "/admin"} className="text-gray-500 hover:text-primary font-bold flex items-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Voltar
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
          {initialData ? 'Editar Evento' : 'Cadastrar Novo Evento'}
        </h2>
        <p className="text-gray-500 mb-8 text-sm md:text-base">
          {initialData ? 'Atualize os detalhes do evento institucional.' : 'Preencha os detalhes do evento que ocorrerá no auditório.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome do Evento"
            placeholder="Ex: Simpósio de Direito Civil"
            value={formData.nome}
            onChange={e => setFormData({ ...formData, nome: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Data"
              type="date"
              value={formData.data}
              onChange={e => setFormData({ ...formData, data: e.target.value })}
              required
            />
            <Input
              label="Horário"
              placeholder="Ex: 19:00 - 22:00"
              value={formData.horario}
              onChange={e => setFormData({ ...formData, horario: e.target.value })}
              required
            />
          </div>

          <Input
            label="Local"
            value={formData.local}
            onChange={e => setFormData({ ...formData, local: e.target.value })}
            required
          />

          <Textarea
            label="Descrição"
            placeholder="Breve descrição do evento..."
            rows={4}
            value={formData.descricao}
            onChange={e => setFormData({ ...formData, descricao: e.target.value })}
            required
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <Link to={initialData ? `/admin/evento/${initialData.id}` : "/admin"} className="px-6 py-4 font-bold text-gray-400 hover:text-gray-600 transition-all flex items-center justify-center">Cancelar</Link>
            <Button type="submit" fullWidth className="sm:w-auto">
              {initialData ? 'Salvar Alterações' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventForm;
