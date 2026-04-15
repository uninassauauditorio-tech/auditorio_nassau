# Documentação do Sistema - Gestão de Eventos UNINASSAU

## 1. Visão Geral
**Descrição do Projeto:**
O Sistema de Gestão de Eventos UNINASSAU é uma plataforma institucional focada no gerenciamento, divulgação, inscrição e controle de presença para eventos acadêmicos realizados no auditório. Desenvolvido com uma arquitetura moderna no ecossistema JavaScript/TypeScript, utilizando React no frontend.

**Objetivo Principal:**
Automatizar e centralizar a gestão do auditório, oferecendo uma interface pública para que alunos e convidados se inscrevam em eventos, além de um painel administrativo completo (protegido por autenticação) para que os organizadores gerenciem participantes, avaliem métricas, validem presença (via leitor de QR Code) e emitam certificados.

---

## 2. Estrutura de Pastas

Abaixo está o detalhamento da estrutura de diretórios encontrada dentro de `src/` e do projeto:

- `src/components/`: Contém os componentes de interface reutilizáveis (Header, Footer, modais, e subdiretório `ui` para componentes de base).
- `src/hooks/`: Guarda Hooks customizados do React, gerenciando o estado global da aplicação (`useEvents.ts`) e preferências do usuário (`useLanguage.ts`).
- `src/lib/`: Destinado a arquivos de configuração de bibliotecas de terceiros.
- `src/pages/`: Páginas da aplicação mapeadas nas rotas. Está dividida logicamente em subdiretórios:
  - `Admin/`: Telas restritas baseadas no painel de controle (Login, Dashboard, Cadastro de Eventos, Arquivo, etc).
  - `Public/`: Telas acessíveis a todos os usuários (Lista de Eventos, Inscrição, Check-in, Tutorial).
- `src/services/`: Camada que lida com regras de negócio, integrações externas (arquitetura de factory, implementações de métodos e interfaces), e lógicas de autenticação.
- `src/types/`: Definições globais de tipagem estática (TypeScript), moldando os objetos que transitam no código.
- `src/utils/`: Funções utilitárias puras, formatadores (data, moeda) e lógicas auxiliares.
- `public/` e `assets/`: Armazenam os recursos estáticos (como imagens, fontes, favicons) utilizados na renderização visual.

---

## 3. Arquivos Principais

- **`src/App.tsx`**: O núcleo de roteamento e estrutura da aplicação. Define todas as rotas (usando `react-router-dom`), faz o carregamento inicial de estado puxando o hook gerencial de "events", e aplica as lógicas de proteção de rota (`<SignedIn>`, `<SignedOut>`).
- **`src/main.tsx`**: O ponto de entrada da aplicação React. Onde a árvore de componentes é montada no DOM base do documento (index.html).
- **`package.json`**: Orquestrador das dependências. Concentra os scripts (`dev`, `build`, `preview`) e a lista de pacotes/versões instaladas (Vite, React, extensões).
- **`vite.config.ts`**: Arquivo de setup do *bundler* Vite, otimizando caminhos e carregamento da build.
- **`README.md`**: É a fachada aberta do projeto no repositório. Tem uma abordagem visual breve listando o funcionamento principal e *badges* das bibliotecas.

---

## 4. Fluxo da Aplicação

### Fluxo Público (Participantes):
1. O usuário acessa a página base (`/`) e visualiza a lista de eventos abertos.
2. Ao clicar em um evento, ele é direcionado à rota `/evento/:id`, lendo informações sobre o evento e preenchendo um formulário para inscrição.
3. Se gerar inscrição com sucesso, pode receber/visualizar seu QR Code ou comprovante.
4. Presencialmente no dia do evento, exibe o QR Code. Existe uma rota de Check-in onde as presenças de visitantes são validadas de forma rápida (QR Code mobile).

### Fluxo Administrativo (Organizadores):
1. O administrador acessa a rota `/admin/login`.
2. A aplicação bloqueia ações e exige autenticação gerida pela ferramenta (Clerk).
3. Após login, ele tem acesso a `/admin/` (Dashboard).
4. No Dashboard e rotas irmãs (como `/admin/novo`), ele cria, edita eventos, acompanha estatísticas (número de confirmados), gerencia inscrições e marca a etapa como encerrada quando o evento termina.
5. Manuais complementares estão embutidos dentro da plataforma em `/admin/documentacao`.

---

## 5. Dependências

O sistema é servido sob modernas bibliotecas:
- **Core / Framework:** `React` (v19), `React DOM`, construído e servido via **Vite**.
- **Linguagem:** **TypeScript**, lidando com dados estritos para escalabilidade.
- **Roteamento:** `react-router-dom` conectando páginas e protegendo navegação interna.
- **Autenticação:** `@clerk/clerk-react`, serviço gerenciado robusto (Identity/Auth).
- **Banco de Dados / Backend as a Service:** `@supabase/supabase-js`, cuidando da persistência de informações sob a arquitetura do Supabase DB.
- **Ferramentas de Layout / UI:** Embora não documentada explicitamente em arquivo único como tailwind.config (provavelmente mesclada ou padronizada), utiliza Tailwind CSS (visto nas tags do App.tsx).
- **Ferramentas Utilitárias Adicionais:** 
  - Geração/Leitura de QR Codes (`qrcode`, `html5-qrcode`).
  - Geração de Recibos/PDFs e manipulações Canvas (`jspdf`, `html2canvas`).
  - Exportação/Leitura de planilhas Excel (`xlsx`).

---

## 6. Como Executar

Se preparar um ambiente de desenvolvimento local for preciso, siga os passos estritos pelo terminal:

1. Acesse o diretório do projeto via terminal.
2. Instale todas as bibliotecas necessárias declaradas no projeto.
   ```bash
   npm install
   ```
3. Garanta que na raiz haja as credenciais corretas contidas em variáveis de ambigente (Você pode olhar o `.env.example`). Crie um arquivo `.env` (ou `.env.local`) incluindo:
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```
   *(Pode ser exigido chaves próprias do Clerk e demais integrações dependendo do setup).*
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. O terminal retornará o link de `localhost` (geralmente porta 5173). Clique ou abra no navegador.

---

## 8. Funcionalidades de Redirecionamento (Link Externo)

Implementada em Abril de 2026, esta funcionalidade permite a criação de eventos que atuam como "pontes" para serviços externos (ex: Avaliação Institucional, AV1, formulários externos).

**Características Principais:**
- **Captura Simplificada:** Diferente de eventos normais, solicita apenas a **Matrícula** do aluno. O nome e CPF são preenchidos automaticamente com a matrícula para manter a compatibilidade do banco.
- **Redirecionamento Automático:** Após o registro do acesso, o sistema redireciona o aluno instantaneamente para a URL cadastrada no campo `link_externo`.
- **Privacidade (Oculto na Home):** Eventos deste tipo **não aparecem** na lista pública do site. O acesso é feito exclusivamente via link direto ou QR Code gerado no painel.
- **Visual de Cartaz para Impressão:** O gerador de QR Code possui um layout específico para estes eventos, imitando cartazes institucionais reais (com cabeçalho cinza e faixas escuras).

**Requisito de Banco de Dados:**
- Tabela `events`: Requer a coluna `link_externo` (tipo `text`) e a permissão do valor `'link_externo'` na restrição de verificação (`CHECK CONSTRAINT`) da coluna `tipo`.

---

## 9. Observações fnais

- **Não altere componentes diretos de roteamento sem certificar credenciais:** Componentes `<SignedIn>` em `App.tsx` amarram as sessões fortemente, sendo fundamental a integridade para não haver vazamento de rotas e dados de participantes.
- **Geração de QR Code:** O sistema utiliza `jspdf` para gerar PDFs A4 prontos para impressão. O layout se adapta automaticamente ao tipo do evento.
- **Sem servidor monolítico de Back-end:** Todas as funções que demandam escrita e leitura pesadas ocorrem diretamente aos serviços BaaS (Supabase e Clerk), centralizando a segurança base nesses acessos.
