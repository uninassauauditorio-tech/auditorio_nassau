import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { generateTutorial } from '../../utils/tutorial';
import AlertDialog from '../../components/ui/AlertDialog';

const TutorialPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const fromForm = searchParams.get('from') === 'form';

    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'info'
    });

    const handleDownload = async () => {
        await generateTutorial(() => {
            setAlertConfig({
                isOpen: true,
                title: 'Tutorial Baixado!',
                message: 'O tutorial foi baixado com sucesso!\n\n📱 No celular: Verifique na Galeria de Fotos ou pasta Downloads\n💻 No computador: Verifique na pasta Downloads',
                type: 'success'
            });
        });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] py-8 px-4 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto animate-in">
                {/* Header - Conditional back button */}
                {fromForm ? (
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm font-black uppercase tracking-tighter cursor-pointer bg-transparent border-none p-0"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Voltar para Inscrição
                    </button>
                ) : (
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm font-black uppercase tracking-tighter">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Voltar para Eventos
                    </Link>
                )}

                {/* Title Section */}
                <div className="bg-primary p-8 md:p-12 rounded-3xl text-center mb-10 shadow-2xl shadow-primary/20">
                    <h1 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight">UNINASSAU</h1>
                    <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-wider">Tutorial de Inscrição em Eventos</p>
                </div>

                {/* Intro */}
                <div className="text-center mb-12">
                    <h2 className="text-primary text-3xl font-black mb-3">Como se Inscrever em um Evento?</h2>
                    <p className="text-gray-600 text-lg">Siga este passo a passo simples e rápido</p>

                    {/* Note for users already in form - only show if from form */}
                    {fromForm && (
                        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
                            <p className="text-blue-800 text-sm font-bold flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">info</span>
                                Já está no formulário? Veja apenas os próximos passos abaixo!
                            </p>
                        </div>
                    )}
                </div>

                {/* Steps */}
                <div className="space-y-6 mb-10">
                    {/* Passo 1 */}
                    <div className={`flex items-start gap-5 p-6 rounded-2xl shadow-sm border-l-4 transition-shadow ${fromForm
                            ? 'bg-gray-50 border-gray-300 opacity-60'
                            : 'bg-white border-primary hover:shadow-md'
                        }`}>
                        <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${fromForm
                                ? 'bg-gray-400 text-white'
                                : 'bg-primary text-white text-2xl font-black'
                            }`}>
                            {fromForm ? <span className="material-symbols-outlined">check</span> : '1'}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-black mb-2 ${fromForm ? 'text-gray-500' : 'text-primary'
                                }`}>
                                {fromForm ? '✓ Escolha o Evento' : 'Escolha o Evento'}
                            </h3>
                            <p className={`leading-relaxed ${fromForm ? 'text-gray-500' : 'text-gray-700'
                                }`}>
                                Navegue pela lista de eventos disponíveis e clique em <strong>"Ver Detalhes"</strong> no evento que deseja participar.
                            </p>
                            {fromForm && (
                                <p className="text-green-600 font-bold text-sm mt-2">Você já fez este passo se está vendo o formulário!</p>
                            )}
                        </div>
                    </div>

                    {/* Passo 2 */}
                    <div className={`flex items-start gap-5 p-6 rounded-2xl shadow-sm border-l-4 transition-shadow ${fromForm
                            ? 'bg-gray-50 border-gray-300 opacity-60'
                            : 'bg-white border-primary hover:shadow-md'
                        }`}>
                        <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${fromForm
                                ? 'bg-gray-400 text-white'
                                : 'bg-primary text-white text-2xl font-black'
                            }`}>
                            {fromForm ? <span className="material-symbols-outlined">check</span> : '2'}
                        </div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-black mb-2 ${fromForm ? 'text-gray-500' : 'text-primary'
                                }`}>
                                {fromForm ? '✓ Clique em "Inscrever-se"' : 'Clique em "Inscrever-se"'}
                            </h3>
                            <p className={`leading-relaxed ${fromForm ? 'text-gray-500' : 'text-gray-700'
                                }`}>
                                Na página de detalhes do evento, clique no botão azul <strong>"Inscrever-se"</strong> para iniciar seu cadastro.
                            </p>
                            {fromForm && (
                                <p className="text-green-600 font-bold text-sm mt-2">Você já fez este passo se está vendo o formulário!</p>
                            )}
                        </div>
                    </div>

                    {/* Passo 3 - DESTACADO apenas se fromForm */}
                    <div className={`flex items-start gap-5 p-6 rounded-2xl shadow-sm border-l-4 transition-shadow ${fromForm
                            ? 'bg-blue-50 shadow-md border-blue-500 ring-2 ring-blue-200'
                            : 'bg-white border-primary hover:shadow-md'
                        }`}>
                        <div className={`size-12 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0 ${fromForm ? 'bg-blue-500 text-white' : 'bg-primary text-white'
                            }`}>
                            3
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className={`text-xl font-black ${fromForm ? 'text-blue-700' : 'text-primary'
                                    }`}>
                                    Preencha seus Dados
                                </h3>
                                {fromForm && (
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">VOCÊ ESTÁ AQUI</span>
                                )}
                            </div>
                            <p className="text-gray-700 mb-3 leading-relaxed">Complete o formulário com suas informações:</p>
                            <ul className="text-gray-700 space-y-1 pl-5">
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    Nome Completo
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    CPF
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    Telefone
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    E-mail
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    Escolaridade
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    Interesse em GraduaçãoSe aplicável)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-sm ${fromForm ? 'text-blue-500' : 'text-primary'
                                        }`}>check_circle</span>
                                    Curso de Interesse (obrigatório se tem interesse)
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Passo 4 */}
                    <div className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-sm border-l-4 border-primary hover:shadow-md transition-shadow">
                        <div className="bg-primary text-white size-12 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0">
                            4
                        </div>
                        <div className="flex-1">
                            <h3 className="text-primary text-xl font-black mb-2">Confirme sua Inscrição</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Revise seus dados e clique em <strong>"Confirmar Inscrição"</strong>. Aguarde a confirmação de sucesso.
                            </p>
                        </div>
                    </div>

                    {/* Passo 5 */}
                    <div className="flex items-start gap-5 p-6 bg-green-50 rounded-2xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
                        <div className="bg-green-500 text-white size-12 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0">
                            5
                        </div>
                        <div className="flex-1">
                            <h3 className="text-green-700 text-xl font-black mb-2">Baixe seu Comprovante</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Após a confirmação, clique em <strong>"Baixar Comprovante"</strong>. Este comprovante em PNG será necessário na entrada do evento!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Important Note */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-10">
                    <div className="flex items-start gap-4">
                        <span className="material-symbols-outlined text-amber-600 text-3xl flex-shrink-0">warning</span>
                        <div>
                            <h4 className="text-amber-900 text-lg font-black mb-2">⚠️ IMPORTANTE</h4>
                            <p className="text-amber-800 leading-relaxed mb-2">
                                📱 <strong>No celular:</strong> O comprovante ficará na <strong>Galeria de Fotos</strong> ou pasta <strong>Downloads</strong>
                            </p>
                            <p className="text-amber-800 leading-relaxed">
                                💻 <strong>No computador:</strong> O comprovante ficará na pasta <strong>Downloads</strong>
                            </p>
                            <p className="text-amber-800 leading-relaxed mt-3 font-bold">
                                Apresente este comprovante na portaria do evento para validar sua presença!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                    >
                        <span className="material-symbols-outlined text-2xl">download</span>
                        Baixar Tutorial em PNG
                    </button>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary border-2 border-primary rounded-2xl font-black text-lg hover:bg-primary-light transition-all"
                    >
                        <span className="material-symbols-outlined text-2xl">event</span>
                        Ver Eventos
                    </Link>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">Sistema de Eventos UNINASSAU</p>
                    <p className="text-gray-400 text-xs mt-1">Precisa de ajuda? Entre em contato com a secretaria</p>
                </div>
            </div>

            {/* Alert Dialog */}
            <AlertDialog
                isOpen={alertConfig.isOpen}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
            />
        </div>
    );
};

export default TutorialPage;
