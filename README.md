# UNINASSAU - Gestão de Eventos Auditório

Sistema de gestão de eventos e inscrições para o auditório da UNINASSAU.

## 🚀 Como Rodar

1.  Instale as dependências (opcional, se for usar npm):
    ```bash
    npm install
    ```
2.  Rode o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Acesse `http://localhost:5173` (ou a porta indicada).

## 📂 Estrutura de Pastas

-   `src/assets`: Arquivos estáticos (CSS, imagens).
-   `src/components`: Componentes reutilizáveis (UI, Header, Footer).
-   `src/pages`: Páginas da aplicação (Admin e Pública).
-   `src/services`: Lógica de negócios e persistência de dados.
-   `src/hooks`: Hooks customizados (gerenciamento de estado).
-   `src/types`: Definições de tipos TypeScript.

## 🔑 Acesso Administrativo

-   **URL**: `/admin`
-   **Senha de Teste**: `admin123`

## 🛠️ Tecnologias

-   React + Vite
-   TypeScript
-   Tailwind CSS (via CDN para simplicidade)
-   React Router DOM

## ✨ Funcionalidades

-   **Público**: Visualizar eventos, inscrever-se (com validação e lógica condicional).
-   **Admin**: Criar eventos, visualizar inscritos, exportar lista (CSV), encerrar eventos.
