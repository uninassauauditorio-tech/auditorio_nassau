import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLocation } from 'react-router-dom';
import { Inscrito } from '../../types';

interface CheckinPageProps {
    validateCheckin: (token: string) => Promise<{ success: boolean; message: string; inscrito?: Inscrito }>;
}

type ScanStatus = 'scanning' | 'validating' | 'success' | 'error' | 'already_scanned';

const CheckinPage: React.FC<CheckinPageProps> = ({ validateCheckin }) => {
    const [status, setStatus] = useState<ScanStatus>('scanning');
    const [resultMessage, setResultMessage] = useState<string>('');
    const [inscrito, setInscrito] = useState<Inscrito | null>(null);
    const [isSecure, setIsSecure] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            setIsSecure(false);
            return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        if (!html5QrCodeRef.current) return;

        setStatus('scanning');
        setCameraError(null);

        try {
            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 15,
                    qrbox: (viewfinderWidth, viewfinderHeight) => {
                        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                        const qrboxSize = Math.floor(minEdge * 0.7);
                        return { width: qrboxSize, height: qrboxSize };
                    },
                    aspectRatio: 1.0
                },
                onScanSuccess,
                onScanFailure
            );
        } catch (err: any) {
            console.error("Erro ao iniciar câmera:", err);
            setCameraError("Câmera não detectada ou permissão negada.");
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
            } catch (err) {
                console.error("Erro ao parar câmera:", err);
            }
        }
    };

    async function onScanSuccess(decodedText: string) {
        let token = decodedText;
        if (decodedText.includes('token=')) {
            const urlParts = decodedText.split('token=');
            if (urlParts.length > 1) {
                token = urlParts[1].split('&')[0].split('#')[0];
            }
        }

        if (token && status === 'scanning') {
            handleValidate(token);
        }
    }

    function onScanFailure() { }

    const handleValidate = async (token: string) => {
        if (!token) return;
        setStatus('validating');
        await stopScanner();

        try {
            const result = await validateCheckin(token);
            setInscrito(result.inscrito || null);
            setResultMessage(result.message || "Sem resposta do servidor.");

            if (result.success) {
                setStatus('success');
                playAudio('success');
            } else if (result.message?.toLowerCase().includes('já foi utilizado') ||
                result.message?.toLowerCase().includes('já utilizou') ||
                result.message?.toLowerCase().includes('já fez')) {
                setStatus('already_scanned');
                playAudio('error');
            } else {
                setStatus('error');
                playAudio('error');
            }
        } catch (error) {
            setStatus('error');
            setResultMessage('Erro de conexão com o servidor. Tente novamente.');
            playAudio('error');
        }
    };

    const playAudio = (type: 'success' | 'error') => {
        const url = type === 'success'
            ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
            : 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3';
        new Audio(url).play().catch(() => { });
    };

    const handleReset = () => {
        setInscrito(null);
        setResultMessage('');
        startScanner();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-0 md:p-4">
            <style>
                {`
                    #reader video {
                        width: 100% !important;
                        height: 100% !important;
                        object-fit: cover !important;
                    }
                    #reader {
                        border: none !important;
                        width: 100% !important;
                        height: 100% !important;
                    }
                    @keyframes scan {
                        0%, 100% { transform: translateY(-120px); opacity: 0; }
                        50% { transform: translateY(120px); opacity: 1; }
                    }
                `}
            </style>

            <div className="max-w-md w-full h-screen md:h-[800px] bg-white md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative">
                <div className="bg-primary p-6 text-center shrink-0 z-20">
                    <h1 className="text-white text-xl font-black tracking-tight">CHECK-IN</h1>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Validação de Presença</p>
                </div>

                <div className="flex-1 relative flex flex-col overflow-hidden">
                    {status === 'scanning' && (
                        <div className="flex-1 flex flex-col relative bg-black">
                            {!isSecure ? (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-white">
                                    <span className="material-symbols-outlined text-amber-500 text-6xl">lock_open</span>
                                    <h2 className="text-gray-800 font-black text-xl">Ambiente Não Seguro</h2>
                                    <p className="text-gray-500 text-sm">A câmera exige uma conexão **HTTPS**.</p>
                                </div>
                            ) : (
                                <>
                                    <div id="reader" className="flex-1"></div>
                                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                                        <div className="size-72 border-2 border-white/20 rounded-[2.5rem] relative">
                                            <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-[2.5rem]"></div>
                                            <div className="absolute -top-1 -left-1 size-12 border-t-4 border-l-4 border-primary rounded-tl-[2rem]"></div>
                                            <div className="absolute -top-1 -right-1 size-12 border-t-4 border-r-4 border-primary rounded-tr-[2rem]"></div>
                                            <div className="absolute -bottom-1 -left-1 size-12 border-b-4 border-l-4 border-primary rounded-bl-[2rem]"></div>
                                            <div className="absolute -bottom-1 -right-1 size-12 border-b-4 border-r-4 border-primary rounded-br-[2rem]"></div>
                                            <div className="absolute left-4 right-4 h-0.5 bg-primary/50 shadow-[0_0_15px_rgba(0,74,153,0.8)] top-1/2 -translate-y-1/2 animate-[scan_2s_infinite_ease-in-out]"></div>
                                        </div>
                                        <p className="mt-12 text-white font-black text-xs uppercase tracking-[0.3em] opacity-80">
                                            Aponte para o QR Code
                                        </p>
                                    </div>
                                    {cameraError && (
                                        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-8 text-center z-30">
                                            <span className="material-symbols-outlined text-red-500 text-6xl mb-4">videocam_off</span>
                                            <p className="text-white font-bold text-lg mb-8">{cameraError}</p>
                                            <button onClick={startScanner} className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm">Tentar Novamente</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {status === 'validating' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 bg-white">
                            <div className="size-24 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-center">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Validando</h2>
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Aguarde um instante...</p>
                            </div>
                        </div>
                    )}

                    {(status === 'success' || status === 'error' || status === 'already_scanned') && (
                        <div className="flex-1 flex flex-col p-8 bg-white animate-in">
                            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                                <div className={`size-40 rounded-[3rem] flex items-center justify-center shadow-2xl ${status === 'success' ? 'bg-green-500 text-white shadow-green-200' :
                                        status === 'already_scanned' ? 'bg-amber-500 text-white shadow-amber-200' :
                                            'bg-red-500 text-white shadow-red-200'
                                    }`}>
                                    <span className="material-symbols-outlined text-8xl font-black">
                                        {status === 'success' ? 'check_circle' : status === 'already_scanned' ? 'history' : 'error'}
                                    </span>
                                </div>

                                <div className="text-center space-y-4">
                                    <div className="space-y-1">
                                        <h2 className={`text-4xl font-black tracking-tighter uppercase ${status === 'success' ? 'text-green-600' :
                                                status === 'already_scanned' ? 'text-amber-600' :
                                                    'text-red-600'
                                            }`}>
                                            {status === 'success' ? 'Confirmado!' : status === 'already_scanned' ? 'Já Utilizado' : 'Falhou!'}
                                        </h2>
                                        {inscrito && (
                                            <p className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                                {inscrito.nomeCompleto}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-gray-500 font-bold text-lg leading-tight px-4">{resultMessage}</p>
                                </div>

                                {inscrito && (
                                    <div className="w-full bg-gray-50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Participante</p>
                                            <p className="text-xl font-black text-gray-900">{inscrito.nomeCompleto.toUpperCase()}</p>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200/50">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPF</p>
                                                <p className="text-sm font-bold text-gray-700">{inscrito.cpf}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                                <p className={`text-sm font-black ${status === 'success' || inscrito.checkedIn ? 'text-green-600' : 'text-red-600'}`}>
                                                    {status === 'success' || inscrito.checkedIn ? 'PRESENTE' : 'PENDENTE'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleReset}
                                className={`w-full py-6 rounded-3xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-4 ${status === 'success' ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-100' :
                                        status === 'already_scanned' ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-100' :
                                            'bg-red-600 hover:bg-red-700 text-white shadow-red-100'
                                    }`}
                            >
                                <span className="material-symbols-outlined font-black">qr_code_scanner</span>
                                PRÓXIMO SCAN
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 text-center border-t border-gray-100 shrink-0">
                    <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">Sistema Institucional • UNINASSAU</p>
                </div>
            </div>
        </div>
    );
};

export default CheckinPage;
