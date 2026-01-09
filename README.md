# 🎓 Sistema de Gestão de Eventos UNINASSAU

Sistema institucional completo para gerenciamento de eventos do auditório UNINASSAU. Desenvolvido com React + TypeScript + Supabase para oferecer uma experiência profissional tanto para administradores quanto para participantes.

![Eventos UNINASSAU](https://img.shields.io/badge/UNINASSAU-Eventos-004a99?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-3fcf8e?style=for-the-badge&logo=supabase)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#-arquitetura)
- [Deploy](#-deploy)
- [Troubleshooting](#-troubleshooting)
- [Contribuindo](#-contribuindo)

## 🎯 Visão Geral

O Sistema de Gestão de Eventos UNINASSAU é uma aplicação web moderna e responsiva que permite:

- **Para Administradores:** Gestão completa de eventos, participantes, análise de dados e relatórios
- **Para Participantes:** Visualização de eventos, inscrição online e geração de comprovantes

### Principais Diferenciais

✅ **Interface Profissional** - Design moderno com identidade visual institucional  
✅ **Totalmente Responsivo** - Funciona perfeitamente em desktop, tablet e mobile  
✅ **Analytics Integrado** - Dashboard com métricas e filtros avançados  
✅ **Upload de Imagens** - Suporte a imagens de eventos via Supabase Storage  
✅ **Busca e Filtros** - Pesquisa em tempo real e filtros por data  
✅ **Comprovante PDF** - Geração automática de comprovante de inscrição  
✅ **Exportação Excel** - Compatível com exportação de dados

## 🚀 Funcionalidades

### 👨‍💼 Painel Administrativo

- **Dashboard Analítico**
  - Filtros por período (data inicial e final)
  - Métricas principais: eventos, participantes, médias
  - Breakdown de interesse (Graduação, Pós, Segunda Graduação)
  - Gráficos e cards visuais

- **Gestão de Eventos**
  - Criar eventos com imagens
  - Editar eventos existentes
  - Excluir eventos (com confirmação)
  - Encerrar inscrições
  - Upload de imagens para Supabase Storage

- **Gestão de Participantes**
  - Visualizar lista de inscritos
  - Imprimir lista com imagem do evento
  - Exportar para Excel
  - Filtrar e buscar participantes

### 🌐 Área Pública

- **Listagem de Eventos**
  - Cards visuais com imagens
  - Busca em tempo real por nome/descrição/local
  - Ordenação automática por data
  - Fallback profissional quando sem imagem

- **Inscrição Online**
  - Formulário intuitivo e validado
  - Exibição da imagem do evento
  - Campos condicionais baseados em escolaridade
  - Geração de comprovante PDF

- **Comprovante Digital**
  - PDF personalizado com dados do evento
  - QR Code de validação
  - Design institucional UNINASSAU

## 🛠 Tecnologias

### Frontend
- **React 18.3** - Framework UI
- **TypeScript 5.6** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **jsPDF** - Geração de PDFs

### Backend & Infraestrutura
- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados
  - Storage - Upload de imagens
  - Auth - Autenticação
  - RLS - Row Level Security

### Bibliotecas Auxiliares
- **@supabase/supabase-js** - Cliente Supabase
- **Material Symbols** - Ícones

## 📦 Requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Conta Supabase** (gratuita)
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

## 🔧 Instalação

### 1. Clone o Repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd uninassau---gestão-de-eventos-auditório
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Execute o Projeto

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:5173`

## ⚙️ Configuração

### Configuração do Supabase

#### 1. Criar Tabelas

Execute os seguintes SQLs no Supabase SQL Editor:

```sql
-- Tabela de eventos
CREATE TABLE events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_evento TEXT NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    horario_evento TEXT,
    local TEXT NOT NULL,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'encerrado')),
    imagem_url TEXT,
    criado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Tabela de inscrições
CREATE TABLE registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    escolaridade TEXT NOT NULL,
    interesse TEXT CHECK (interesse IN ('graduacao', 'pos', 'segunda_graduacao')),
    curso TEXT,
    data_inscricao TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);
```

#### 2. Configurar Storage

1. Crie um bucket chamado `imagem eventos`
2. Configure como **público**
3. Adicione políticas:

```sql
-- Permitir upload para usuários autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'imagem eventos');

-- Permitir leitura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'imagem eventos');
```

#### 3. Configurar Autenticação

O sistema usa **Email/Password Authentication**. Configure no painel Supabase:

1. Vá em **Authentication > Providers**
2. Habilite **Email**
3. Crie usuários admin pelo painel

### Credenciais de Teste

Durante desenvolvimento, você configurou:
- Email: `edgareda2015@gmail.com`
- Senha: `240686`

## 📖 Uso

### Acesso Administrativo

1. Acesse `/admin/login`
2. Faça login com credenciais de administrador
3. Navegue pelo dashboard

### Criar Evento

1. Clique em **"Novo Evento"**
2. Preencha os dados:
   - Nome do evento
   - Data e horário
   - Local
   - Imagem (opcional)
   - Descrição
3. Clique em **"Criar Evento"**

### Inscrição de Participante

1. Na página inicial, visualize os eventos disponíveis
2. Clique em **"Confirmar Presença"**
3. Preencha o formulário
4. Baixe o comprovante PDF

### Análise de Dados

1. No dashboard admin, configure filtros de data
2. Visualize métricas atualizadas automaticamente
3. Analise o perfil de interesse dos participantes

## 📁 Estrutura do Projeto

```
uninassau---gestão-de-eventos-auditório/
├── public/
│   ├── fundo.png              # Background institucional
│   ├── logo.png               # Logo UNINASSAU
│   └── favicon.png            # Favicon
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   └── global.css     # Estilos globais
│   │   └── img/
│   │       └── logo.png       # Logo (asset importado)
│   ├── components/
│   │   ├── ui/                # Componentes reutilizáveis
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── RadioGroup.tsx
│   │   ├── Header.tsx         # Cabeçalho
│   │   └── Footer.tsx         # Rodapé
│   ├── hooks/
│   │   └── useEvents.ts       # Hook principal de estado
│   ├── lib/
│   │   └── supabase.ts        # Cliente Supabase
│   ├── pages/
│   │   ├── Admin/             # Páginas administrativas
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Archive.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   └── Login.tsx
│   │   └── Public/            # Páginas públicas
│   │       ├── EventList.tsx
│   │       └── EventRegistration.tsx
│   ├── services/
│   │   ├── interfaces/
│   │   │   └── EventService.ts      # Interface do serviço
│   │   ├── implementations/
│   │   │   └── SupabaseEventService.ts  # Implementação Supabase
│   │   ├── auth.ts            # Serviço de autenticação
│   │   └── factory.ts         # Factory de serviços
│   ├── types/
│   │   └── index.ts           # Definições TypeScript
│   ├── App.tsx                # Componente raiz
│   └── main.tsx               # Entry point
├── .env.local                 # Variáveis de ambiente (não versionado)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🏗 Arquitetura

### Padrão de Autenticação

O sistema implementa um **fluxo determinístico de autenticação** com estado `authReady`:

```typescript
useEffect #1: Inicialização de Auth
  ↓
getSession() - Aguarda resolução
  ↓
setIsAdmin() - Define estado admin
  ↓
setAuthReady(true) - Marca como pronta
  ↓
onAuthStateChange() - Configura listener

useEffect #2: Carregamento de Dados
  ↓
if (!authReady) return - Bloqueia até pronto
  ↓
loadEvents() - Carrega dados
```

**Benefícios:**
- ✅ Elimina race conditions
- ✅ Funcionamento 100% confiável
- ✅ Independente de velocidade do dispositivo

### Camadas da Aplicação

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (Pages, Components, Forms)         │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         State Management            │
│         (useEvents hook)            │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Service Layer (Factory)        │
│    (EventService interface)         │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│   Implementation (Supabase)         │
│  (SupabaseEventService)             │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│         Supabase Backend            │
│  (PostgreSQL, Storage, Auth)        │
└─────────────────────────────────────┘
```

## 🚢 Deploy

### Vercel (Recomendado)

1. Faça fork do repositório
2. Conecte à Vercel
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático!

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Configure environment variables
4. Deploy

### Build Manual

```bash
npm run build
```

Os arquivos estarão em `/dist`

## 🐛 Troubleshooting

### Problema: "Queries falhando intermitentemente"

**Solução:** Verifique se o sistema está com `authReady` implementado. Veja `auth-race-condition-fix.md` para detalhes.

### Problema: "Logo não aparece"

**Solução:** 
- Verifique se `logo.png` está em `/public`
- Limpe o cache do navegador
- Reconstrua o projeto: `npm run dev`

### Problema: "Upload de imagens falha"

**Solução:**
- Verifique as políticas do bucket `imagem eventos`
- Confirme que o bucket é público
- Verifique credenciais Supabase

### Problema: "Autenticação não funciona"

**Solução:**
- Verifique variáveis de ambiente
- Confirme que o usuário existe no Supabase Auth
- Verifique console para erros

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para uso institucional da UNINASSAU.

## 👥 Autores

Desenvolvido para UNINASSAU - 2026

## 🙏 Agradecimentos

- Equipe UNINASSAU
- Comunidade React
- Supabase Team

---

**🎓 Sistema Profissional de Gestão de Eventos UNINASSAU**  
*Desenvolvido com excelência técnica para a comunidade acadêmica*
