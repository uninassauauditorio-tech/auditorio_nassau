import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useLocation } from 'react-router-dom';
import { Inscrito } from '../../types';

interface CheckinPageProps {
    validateCheckin: (token: string) => Promise<{ success: boolean; message: string; inscrito?: Inscrito }>;
}

const CheckinPage: React.FC<CheckinPageProps> = ({ validateCheckin }) => {
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string; inscrito?: Inscrito } | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Inicializar scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
      /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        // Verificar se há token na URL (para testes ou links diretos)
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            handleValidate(token);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
            }
        };
    }, []);

    async function onScanSuccess(decodedText: string) {
        // O decodedText deve ser a URL completa ou apenas o token
        // Formato esperado: ...#/checkin?token=TOKEN
        let token = decodedText;
        if (decodedText.includes('token=')) {
            token = decodedText.split('token=')[1].split('&')[0];
        }

        if (isScanning && !isLoading) {
            handleValidate(token);
        }
    }

    function onScanFailure(error: any) {
        // Erros de leitura (comum enquanto a câmera foca)
        // console.warn(`Code scan error = ${error}`);
    }

    const handleValidate = async (token: string) => {
        setIsScanning(false);
        setIsLoading(true);
        try {
            const result = await validateCheckin(token);
            setScanResult(result);

            // Som de feedback (opcional)
            if (result.success) {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play().catch(() => { });
            } else {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3');
                audio.play().catch(() => { });
            }
        } catch (error) {
            setScanResult({ success: false, message: 'Erro ao validar token.' });
        } finally {
            setIsLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                <div className="bg-primary p-8 text-center">
                    <h1 className="text-white text-2xl font-black tracking-tight">CHECK-IN</h1>
                    <p className="text-white/70 text-sm font-bold uppercase tracking-widest mt-1">Validação de Presença</p>
                </div>

                <div className="p-8">
                    {isScanning ? (
                        <div className="space-y-6">
                            <div id="reader" className="overflow-hidden rounded-3xl border-4 border-gray-100"></div>
                            <div className="text-center">
                                <p className="text-gray-400 font-black text-xs uppercase tracking-widest">Aponte a câmera para o QR Code</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-8 animate-in">
                            {isLoading ? (
                                <div className="py-12">
                                    <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-500 font-bold">Validando...</p>
                                </div>
                            ) : (
                                <>
                                    <div className={`size-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-lg ${scanResult?.success ? 'bg-green-50 text-green-500 shadow-green-200/50' : 'bg-red-50 text-red-500 shadow-red-200/50'
                                        }`}>
                                        <span className="material-symbols-outlined text-6xl font-black">
                                            {scanResult?.success ? 'check_circle' : 'error'}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className={`text-3xl font-black mb-2 ${scanResult?.success ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {scanResult?.success ? 'Entrada Confirmada!' : 'Falha na Validação'}
                                        </h2>
                                        <p className="text-gray-500 font-medium text-lg">{scanResult?.message}</p>
                                    </div>

                                    {scanResult?.inscrito && (
                                        <div className="bg-gray-50 p-6 rounded-3xl text-left border border-gray-100 space-y-3">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Participante</p>
                                                <p className="text-lg font-bold text-gray-800">{scanResult.inscrito.nomeCompleto.toUpperCase()}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPF</p>
                                                    <p className="text-sm font-bold text-gray-700">{scanResult.inscrito.cpf}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                                                    <p className={`text-sm font-bold ${scanResult.success ? 'text-green-600' : 'text-red-600'}`}>
                                                        {scanResult.success ? 'PRESENTE' : 'NÃO VALIDADO'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={resetScanner}
                                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                                    >
                                        <span className="material-symbols-outlined font-black">qr_code_scanner</span>
                                        NOVO SCAN
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs font-bold uppercase tracking-widest">
                Sistema Institucional de Eventos • UNINASSAU
            </p>
        </div>
    );
};

export default CheckinPage;
