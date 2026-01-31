
export interface Evento {
  id: string;
  nome: string;
  data: string;
  horario: string;
  descricao: string;
  local: string;
  encerrado: boolean;
  inscritos: Inscrito[];
  imagem?: string;
  tipo?: 'interno' | 'externo';
}

export interface Inscrito {
  id: string;
  nomeCompleto: string;
  telefone: string;
  cpf: string;
  email: string;
  escolaridade: string;
  interesseGraduacao?: string; // Sim/Não
  interesseTipo?: string; // Nova Graduação / Pós / Não
  cursoInteresse?: string;
  dataInscricao: string;
  qrToken?: string;
  checkedIn?: boolean;
  checkinDate?: string;
}

export enum Escolaridade {
  FUNDAMENTAL = 'Ensino fundamental',
  MEDIO_COMPLETO = 'Ensino médio completo',
  MEDIO_ANDAMENTO = 'Ensino médio em andamento',
  SUPERIOR_ANDAMENTO = 'Ensino superior em andamento',
  SUPERIOR_COMPLETO = 'Ensino superior completo',
  POS_GRADUACAO = 'Pós-graduação'
}
