import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLocation } from 'react-router-dom';
import { Inscrito } from '../../types';

interface CheckinPageProps {
    validateCheckin: (token: string) => Promise<{ success: boolean; message: string; inscrito?: Inscrito }>;
}

const CheckinPage: React.FC<CheckinPageProps> = ({ validateCheckin }) => {
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string; inscrito?: Inscrito } | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSecure, setIsSecure] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Verificar se o ambiente é seguro (HTTPS ou localhost)
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            setIsSecure(false);
            return;
        }

        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        startScanner();

        return () => {
            if (html5QrCodeRef.current?.isScanning) {
                html5QrCodeRef.current.stop().catch(console.error);
            }
        };
    }, []);

    const startScanner = async () => {
        if (!html5QrCodeRef.current) return;

        try {
            setCameraError(null);
            await html5QrCodeRef.current.start(
                { facingMode: "environment" }, // Forçar câmera traseira
                {
                    fps: 10,
                    qrbox: { width: 280, height: 280 },
                    aspectRatio: 1.0
                },
                onScanSuccess,
                onScanFailure
            );
        } catch (err: any) {
            console.error("Erro ao iniciar câmera:", err);
            setCameraError("Não foi possível acessar a câmera traseira.");
        }
    };

    async function onScanSuccess(decodedText: string) {
        let token = decodedText;
        if (decodedText.includes('token=')) {
            token = decodedText.split('token=')[1].split('&')[0];
        }

        if (isScanning && !isLoading) {
            handleValidate(token);
        }
    }

    function onScanFailure() {
        // Silencioso
    }

    const handleValidate = async (token: string) => {
        setIsScanning(false);
        setIsLoading(true);

        // Parar a câmera para focar no resultado
        if (html5QrCodeRef.current?.isScanning) {
            await html5QrCodeRef.current.stop().catch(console.error);
        }

        try {
            const result = await validateCheckin(token);
            setScanResult(result);

            // Som de feedback
            const audioUrl = result.success
                ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
                : 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3';
            new Audio(audioUrl).play().catch(() => { });

            // Reset automático após 3 segundos
            setTimeout(() => {
                resetScanner();
            }, 3000);

        } catch (error) {
            setScanResult({ success: false, message: 'Erro ao validar token.' });
            setTimeout(() => resetScanner(), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setIsScanning(true);
        startScanner();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-0 md:p-4">
            <div className="max-w-md w-full h-screen md:h-auto bg-white md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">

                {/* Header Minimalista */}
                <div className="bg-primary p-6 text-center shrink-0">
                    <h1 className="text-white text-xl font-black tracking-tight">CHECK-IN</h1>
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Validação de Presença</p>
                </div>

                <div className="flex-1 flex flex-col relative bg-gray-50">
                    {!isSecure ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                            <span className="material-symbols-outlined text-amber-500 text-6xl">lock_open</span>
                            <h2 className="text-gray-800 font-black text-xl">Ambiente Não Seguro</h2>
                            <p className="text-gray-500 text-sm">A câmera exige uma conexão **HTTPS**.</p>
                        </div>
                    ) : isScanning ? (
                        <div className="flex-1 flex flex-col relative">
                            {/* Container da Câmera - Ocupa o máximo de espaço */}
                            <div id="reader" className="flex-1 bg-black overflow-hidden relative">
                                {cameraError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-900 z-10">
                                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">videocam_off</span>
                                        <p className="text-white font-bold mb-6">{cameraError}</p>
                                        <button
                                            onClick={startScanner}
                                            className="bg-primary text-white px-8 py-3 rounded-xl font-black text-sm uppercase"
                                        >
                                            Tentar Novamente
                                        </button>
                                    </div>
                                )}

                                {/* Overlay de Scan */}
                                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none z-0 flex items-center justify-center">
                                    <div className="size-64 border-2 border-primary/50 rounded-3xl relative">
                                        <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-3xl"></div>
                                        {/* Cantos destacados */}
                                        <div className="absolute -top-1 -left-1 size-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                                        <div className="absolute -top-1 -right-1 size-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                                        <div className="absolute -bottom-1 -left-1 size-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                                        <div className="absolute -bottom-1 -right-1 size-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Instrução Inferior */}
                            <div className="p-6 bg-white border-t border-gray-100 text-center">
                                <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest animate-bounce">
                                    Aponte para o QR Code
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in">
                            {isLoading ? (
                                <div className="space-y-4">
                                    <div className="size-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="text-gray-500 font-black uppercase text-xs tracking-widest">Validando...</p>
                                </div>
                            ) : (
                                <>
                                    <div className={`size-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl ${scanResult?.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        <span className="material-symbols-outlined text-7xl font-black">
                                            {scanResult?.success ? 'check_circle' : 'error'}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className={`text-3xl font-black mb-2 ${scanResult?.success ? 'text-green-600' : 'text-red-600'}`}>
                                            {scanResult?.success ? 'CONFIRMADO!' : 'ERRO!'}
                                        </h2>
                                        <p className="text-gray-500 font-bold text-lg">{scanResult?.message}</p>
                                    </div>

                                    {scanResult?.inscrito && (
                                        <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-left space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Participante</p>
                                                <p className="text-xl font-black text-gray-900">{scanResult.inscrito.nomeCompleto.toUpperCase()}</p>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPF</p>
                                                    <p className="text-sm font-bold text-gray-700">{scanResult.inscrito.cpf}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${scanResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        {scanResult.success ? 'PRESENTE' : 'FALHA'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                            Reiniciando em 3 segundos...
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckinPage;
