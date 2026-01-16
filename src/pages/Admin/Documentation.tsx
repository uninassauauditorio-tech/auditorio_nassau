import React from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const AdminDocumentation: React.FC = () => {
    const handleGeneratePDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const primaryColor = '#004A99';
        const secondaryColor = '#333333';
        const margin = 20;
        let y = 30;

        const checkPage = (needed: number) => {
            if (y + needed > 275) {
                doc.addPage();
                y = 20;
            }
        };

        const addTitle = (text: string) => {
            checkPage(15);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(primaryColor);
            doc.text(text, margin, y);
            y += 8;
        };

        const addText = (text: string) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(secondaryColor);
            const lines = doc.splitTextToSize(text, 170);
            checkPage(lines.length * 5 + 5);
            doc.text(lines, margin, y);
            y += lines.length * 5 + 5;
        };

        const addBullet = (items: string[]) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(secondaryColor);
            items.forEach(item => {
                const lines = doc.splitTextToSize("• " + item, 165);
                checkPage(lines.length * 5 + 2);
                doc.text(lines, margin + 5, y);
                y += lines.length * 5 + 2;
            });
            y += 3;
        };

        // Capa
        doc.setFillColor(primaryColor);
        doc.rect(0, 0, 210, 50, 'F');
        doc.setTextColor('#FFFFFF');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text('DOCUMENTAÇÃO DO SISTEMA', margin, 25);
        doc.setFontSize(10);
        doc.text('SISTEMA DE GESTÃO DE EVENTOS UNINASSAU', margin, 35);

        y = 65;

        addTitle('1. VISÃO GERAL DO PROJETO');
        addText('O Sistema de Gestão de Eventos UNINASSAU é uma solução institucional de alto nível para o gerenciamento de eventos realizados no auditório. O sistema foi projetado sob os pilares de escalabilidade, segurança de dados e experiência do usuário premium, atendendo tanto à comunidade acadêmica quanto à equipe administrativa.');

        addTitle('2. SEGURANÇA E PROTEÇÃO DE DADOS (LGPD)');
        addText('A segurança é a base da nossa arquitetura. Implementamos múltiplas camadas de proteção para garantir a integridade das informações:');
        addBullet([
            "Autenticação Robusta: Acesso administrativo protegido por criptografia de ponta a ponta via Supabase Auth (JWT).",
            "Row Level Security (RLS): Tecnologia que isola os dados no nível do banco de dados, garantindo que apenas usuários autorizados acessem informações específicas.",
            "Tokens Criptográficos: Os QR Codes utilizam tokens aleatórios de 128 bits (alta entropia), impossibilitando fraudes ou adivinhação de códigos.",
            "Comunicação Segura: Todo o tráfego de dados é realizado via HTTPS com certificados SSL/TLS 1.3 ativos.",
            "Criptografia em Repouso: Todos os dados armazenados nos servidores são criptografados utilizando o padrão AES-256.",
            "Trilha de Auditoria: Registro detalhado de todas as ações administrativas e de check-in para auditoria futura.",
            "Prevenção de Ataques: Proteção nativa contra SQL Injection, XSS e CSRF através do uso de frameworks modernos e sanitização de dados."
        ]);

        addTitle('3. ÁREA PÚBLICA (PORTAL DO ALUNO)');
        addText('A interface pública é o ponto de contato com os participantes. Suas principais funcionalidades incluem:');
        addBullet([
            "Vitrine de Eventos: Exibição dinâmica de eventos ativos com imagens e detalhes.",
            "Busca Inteligente: Filtro em tempo real por nome, local ou descrição.",
            "Inscrição Simplificada: Formulário com validação de CPF, e-mail e campos condicionais de interesse acadêmico.",
            "Comprovante Instantâneo: Geração automática de comprovante em PDF (formato A5) com QR Code único para entrada."
        ]);

        addTitle('4. PAINEL ADMINISTRATIVO');
        addText('O coração da gestão do sistema, acessível apenas via autenticação segura:');
        addBullet([
            "Dashboard de Métricas: Visualização de total de inscritos, média por evento e perfil de interesse.",
            "Filtros de Período: Análise de dados baseada em intervalos de datas específicos.",
            "Gestão de Eventos: Criação, edição e encerramento de eventos com upload de imagens para nuvem.",
            "Arquivo Histórico: Acesso a eventos encerrados para consulta de dados passados.",
            "Exportação de Dados: Geração de planilhas Excel (XLSX) com a lista completa de participantes."
        ]);

        addTitle('5. SISTEMA DE CHECK-IN E VALIDAÇÃO');
        addText('O sistema utiliza uma tecnologia de scanner customizada para garantir agilidade na portaria:');
        addBullet([
            "Scanner QR Code: Interface minimalista otimizada para smartphones, com foco automático e feedback sonoro.",
            "Validação em Tempo Real: Identificação imediata de inscrições válidas, duplicadas ou inexistentes.",
            "Destaque Visual: Exibição do nome do participante em letras grandes para conferência rápida.",
            "Check-in Manual: Opção para administradores confirmarem a presença de alunos que não possuem o código."
        ]);

        addTitle('6. GESTÃO DE DOCUMENTOS');
        addText('O sistema diferencia os documentos emitidos com base no status do participante:');
        addBullet([
            "Comprovante de Inscrição: Emitido antes da entrada, focado nos dados do evento e QR Code.",
            "Certificado de Presença: Emitido após a validação do check-in, incluindo data e hora exata da presença como prova oficial."
        ]);

        addTitle('7. INFRAESTRUTURA E RESILIÊNCIA');
        addText('O sistema utiliza a infraestrutura do Supabase (Enterprise-grade), que oferece:');
        addBullet([
            "Alta Disponibilidade: Garantia de que o sistema estará online durante eventos de grande porte.",
            "Backups Automáticos: Proteção contra perda de dados com rotinas de backup constantes e redundância geográfica.",
            "Proteção DDoS: Segurança nativa contra ataques de negação de serviço."
        ]);

        // Rodapé
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor('#999999');
            doc.text(`Documentação Técnica e Operacional UNINASSAU - Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
        }

        doc.save('documentação.pdf');
    };

    return (
        <div className="container mx-auto px-4 py-8 animate-in">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-black uppercase tracking-tighter">
                        <span className="material-symbols-outlined font-bold">arrow_back</span>
                        Voltar ao Painel
                    </Link>

                    <button
                        onClick={handleGeneratePDF}
                        className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">description</span>
                        Baixar Documentação (PDF)
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-primary p-8 md:p-12 text-center relative overflow-hidden">
                        <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-white/10 text-9xl">menu_book</span>
                        <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-2 relative z-10">DOCUMENTAÇÃO DO SISTEMA</h1>
                        <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-xs relative z-10">Manual Completo de Operação e Segurança</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Seção 1: Visão Geral */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">stars</span>
                                </span>
                                1. Visão Geral do Projeto
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                O Sistema de Gestão de Eventos UNINASSAU é uma solução institucional completa para o gerenciamento de eventos realizados no auditório.
                                O sistema foi projetado para ser robusto, seguro e totalmente responsivo, atendendo tanto à comunidade acadêmica quanto à equipe administrativa.
                            </p>
                        </section>

                        {/* Seção 2: Segurança (Destaque) */}
                        <section className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-8 opacity-10">
                                <span className="material-symbols-outlined text-8xl text-primary">verified_user</span>
                            </div>
                            <h2 className="text-2xl font-black text-primary mb-6 flex items-center gap-3 relative z-10">
                                <span className="material-symbols-outlined">shield</span>
                                2. Segurança e Proteção de Dados
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-primary font-bold">lock</span>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Criptografia JWT</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">Autenticação administrativa protegida por tokens criptografados.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-primary font-bold">database</span>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Isolamento RLS</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">Políticas de banco de dados que impedem acessos não autorizados.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-primary font-bold">vpn_lock</span>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">TLS 1.3 (SSL)</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">Comunicação 100% criptografada entre usuário e servidor.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-primary font-bold">qr_code_2</span>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Tokens de 128 bits</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">QR Codes impossíveis de serem fraudados ou previstos.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-primary font-bold">encrypted</span>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Criptografia AES-256</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">Dados protegidos mesmo quando parados no servidor.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="material-symbols-outlined text-primary font-bold">history</span>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-tight">Trilha de Auditoria</h4>
                                            <p className="text-xs text-gray-600 leading-relaxed">Registro completo de todas as ações para fiscalização.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Seção 3: Área Pública */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">public</span>
                                </span>
                                3. Área Pública (Portal do Aluno)
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 border border-gray-100 rounded-3xl shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-2">Vitrine e Busca</h4>
                                    <p className="text-sm text-gray-500">Exibição de eventos e filtros em tempo real.</p>
                                </div>
                                <div className="p-6 border border-gray-100 rounded-3xl shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-2">Inscrição e Comprovante</h4>
                                    <p className="text-sm text-gray-500">Cadastro validado e geração de PDF A5 com QR Code.</p>
                                </div>
                            </div>
                        </section>

                        {/* Seção 4: Painel Admin */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">dashboard_customize</span>
                                </span>
                                4. Painel Administrativo
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                Gestão centralizada com dashboard de métricas, controle de eventos ativos/arquivados e exportação de dados para Excel.
                            </p>
                        </section>

                        {/* Seção 5: Check-in */}
                        <section className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">qr_code_scanner</span>
                                </span>
                                5. Sistema de Check-in
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Scanner profissional com feedback visual e sonoro, suporte a check-in manual e auditoria de presença.
                            </p>
                        </section>

                        {/* Seção 6: Documentos */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <span className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined">description</span>
                                </span>
                                6. Gestão de Documentos
                            </h2>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 p-6 border border-gray-100 rounded-3xl shadow-sm">
                                    <p className="font-bold text-gray-900">Recibo de Inscrição</p>
                                    <p className="text-xs text-gray-500">Para validação na entrada.</p>
                                </div>
                                <div className="flex-1 p-6 border border-gray-100 rounded-3xl shadow-sm">
                                    <p className="font-bold text-gray-900">Certificado de Presença</p>
                                    <p className="text-xs text-gray-500">Prova oficial de participação.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="p-8 bg-gray-50 text-center border-t border-gray-100">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            Documentação Institucional • UNINASSAU • 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDocumentation;
