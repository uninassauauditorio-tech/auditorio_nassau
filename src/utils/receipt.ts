import QRCode from 'qrcode';
import { Evento, Inscrito } from '../types';
import logo from '../assets/img/logo.png';

export const generateReceipt = async (evento: Evento, inscrito: Inscrito, onSuccess?: () => void) => {
    const primaryColor = '#004a99';
    const secondaryColor = '#333333';

    if (inscrito.checkedIn) {
        return generateCertificate(evento, inscrito, onSuccess);
    }

    // Generate QR Code for Receipt
    const qrCodeDataUrl = await QRCode.toDataURL(inscrito.qrToken || '', {
        margin: 1,
        width: 400,
        color: {
            dark: primaryColor,
            light: '#ffffff'
        }
    });

    const container = document.createElement('div');
    container.style.cssText = `
        width: 595px;
        min-height: 842px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: 'Inter', Arial, sans-serif;
        padding: 40px;
        box-sizing: border-box;
    `;

    container.innerHTML = `
        <div style="border: 4px solid ${primaryColor}; border-radius: 24px; padding: 0; min-height: 760px; display: flex; flex-direction: column; overflow: hidden;">
            <!-- Header -->
            <div style="background: ${primaryColor}; padding: 40px 30px; text-align: center;">
                <img src="${logo}" style="height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1);" />
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">Comprovante de Inscrição</h1>
            </div>

            <div style="padding: 40px; flex-grow: 1;">
                <div style="margin-bottom: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Evento</p>
                    <h2 style="color: ${primaryColor}; font-size: 22px; font-weight: 900; margin: 0;">${evento.nome}</h2>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div>
                        <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Participante</p>
                        <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${inscrito.nomeCompleto.toUpperCase()}</p>
                    </div>
                    <div>
                        <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">CPF</p>
                        <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${inscrito.cpf || 'N/A'}</p>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Data e Horário</p>
                    <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario}</p>
                </div>

                <div style="margin-bottom: 40px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Local</p>
                    <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${evento.local}</p>
                </div>

                <!-- QR Code - Centered in remaining space -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 20px;">
                    <div style="padding: 15px; border: 2px solid ${primaryColor}; border-radius: 20px; background: white;">
                        <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px; display: block;" />
                    </div>
                    <p style="color: ${primaryColor}; font-size: 12px; font-weight: 900; margin: 15px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Apresente na Entrada</p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 25px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #64748b; font-size: 10px; font-weight: 600; margin: 0; line-height: 1.5;">
                    Documento gerado automaticamente pelo Sistema de Gestão de Eventos UNINASSAU.<br/>
                    Emissão: ${new Date().toLocaleString('pt-BR')}
                </p>
            </div>
        </div>
    `;

    await downloadContainerAsImage(container, `comprovante-${inscrito.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}`, onSuccess);
};

const generateCertificate = async (evento: Evento, inscrito: Inscrito, onSuccess?: () => void) => {
    const primaryColor = '#004a99';

    const container = document.createElement('div');
    container.style.cssText = `
        width: 842px;
        height: 595px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: 'serif', Arial, sans-serif;
        box-sizing: border-box;
        overflow: hidden;
    `;

    container.innerHTML = `
        <div style="width: 100%; height: 100%; border: 20px solid ${primaryColor}; padding: 40px; box-sizing: border-box; position: relative; background: #fffcf5;">
            <!-- Decorative Corners -->
            <div style="position: absolute; top: -10px; left: -10px; width: 100px; height: 100px; border-top: 30px solid white; border-left: 30px solid white; pointer-events: none;"></div>
            <div style="position: absolute; top: -10px; right: -10px; width: 100px; height: 100px; border-top: 30px solid white; border-right: 30px solid white; pointer-events: none;"></div>
            <div style="position: absolute; bottom: -10px; left: -10px; width: 100px; height: 100px; border-bottom: 30px solid white; border-left: 30px solid white; pointer-events: none;"></div>
            <div style="position: absolute; bottom: -10px; right: -10px; width: 100px; height: 100px; border-bottom: 30px solid white; border-right: 30px solid white; pointer-events: none;"></div>

            <!-- Content Area -->
            <div style="border: 2px solid ${primaryColor}44; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-radius: 8px; position: relative;">
                
                <!-- Watermark Logo -->
                <img src="${logo}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; opacity: 0.03; pointer-events: none;" />

                <img src="${logo}" style="height: 70px; margin-bottom: 30px;" />
                
                <h1 style="font-family: 'Times New Roman', serif; font-size: 48px; color: ${primaryColor}; margin: 0 0 10px 0; font-weight: 400; letter-spacing: 2px;">CERTIFICADO</h1>
                <p style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; color: #666; margin-bottom: 40px;">De Participação</p>

                <div style="text-align: center; max-width: 650px; line-height: 1.8; color: #333;">
                    <p style="font-size: 18px; margin: 0;">Certificamos que</p>
                    <p style="font-size: 32px; font-family: 'Times New Roman', serif; font-weight: bold; color: ${primaryColor}; margin: 10px 0;">${inscrito.nomeCompleto.toUpperCase()}</p>
                    <p style="font-size: 18px; margin: 0;">
                        participou do evento <strong style="color: ${primaryColor};">${evento.nome}</strong> 
                        realizado em <strong>${new Date(evento.data).toLocaleDateString('pt-BR')}</strong> 
                        no <strong>${evento.local}</strong>, com registro de presença validado às 
                        ${inscrito.checkinDate ? new Date(inscrito.checkinDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}.
                    </p>
                </div>

                <div style="margin-top: 50px; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px;">
                    <div style="text-align: center;">
                        <div style="width: 200px; border-top: 1px solid #333; margin-bottom: 10px;"></div>
                        <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; margin: 0;">Coordenação de Eventos</p>
                        <p style="font-size: 10px; color: #666; margin: 0;">UNINASSAU</p>
                    </div>

                    <div style="text-align: center;">
                        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Olinda, ${new Date().toLocaleDateString('pt-BR')}</p>
                        <p style="font-size: 8px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Código de Autenticação: ${inscrito.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    await downloadContainerAsImage(container, `certificado-${inscrito.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}`, onSuccess);
};

export const generateEventRedirectQRCode = async (
    evento: Evento,
    customTexts?: {
        mainTitle?: string;
        subtitle?: string;
        instruction?: string;
        footer?: string;
    },
    onSuccess?: () => void
) => {
    const primaryColor = '#004a99';
    const secondaryColor = '#333333';

    // Construct the registration URL - Use production URL if available
    const productionUrl = import.meta.env.VITE_PRODUCTION_URL;
    const baseUrl = productionUrl || (window.location.origin + window.location.pathname);
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const registrationUrl = `${cleanBaseUrl}#/evento/${evento.id}`;

    console.log('Generated QR Code URL:', registrationUrl); // Debug log

    // Default texts (editable)
    const texts = {
        mainTitle: customTexts?.mainTitle || 'Faça sua Inscrição Online!',
        subtitle: customTexts?.subtitle || 'Evento UNINASSAU',
        instruction: customTexts?.instruction || 'Aponte a câmera do seu celular para o QR Code e se inscreva em segundos. Rápido, fácil e seguro!',
        footer: customTexts?.footer || 'Inscrições gratuitas • Vagas limitadas • Garanta sua presença'
    };

    // Generate QR Code with higher resolution
    const qrCodeDataUrl = await QRCode.toDataURL(registrationUrl, {
        margin: 2,
        width: 800,
        color: {
            dark: primaryColor,
            light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
    });

    console.log('✅ QR Code gerado para URL:', registrationUrl);
    console.log('📊 Tamanho do QR Code (base64):', qrCodeDataUrl.length, 'caracteres');


    const container = document.createElement('div');
    // A4 Portrait: 210mm x 297mm = 595px x 842px at 72 DPI
    container.style.cssText = `
        width: 595px;
        height: 842px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    `;

    container.innerHTML = `
        <div style="
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            padding: 35px 30px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        ">
            <!-- Background Pattern -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0.03;
                background-image: repeating-linear-gradient(45deg, ${primaryColor} 0px, ${primaryColor} 2px, transparent 2px, transparent 10px);
                pointer-events: none;
            "></div>

            <!-- Header -->
            <div style="text-align: center; position: relative; z-index: 1;">
                <img src="${logo}" style="height: 70px; margin-bottom: 25px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" />
                
                <div style="
                    background: white;
                    border: 5px solid ${primaryColor};
                    border-radius: 25px;
                    padding: 25px 30px;
                    box-shadow: 0 10px 40px rgba(0,74,153,0.15);
                ">
                    <h1 style="
                        color: ${primaryColor};
                        margin: 0 0 12px 0;
                        font-size: 36px;
                        font-weight: 900;
                        line-height: 1.1;
                        text-transform: uppercase;
                        letter-spacing: -1px;
                    ">${texts.mainTitle}</h1>
                    
                    <div style="width: 60px; height: 4px; background: ${primaryColor}; margin: 0 auto 15px auto; border-radius: 10px;"></div>
                    
                    <p style="
                        color: ${secondaryColor};
                        font-size: 16px;
                        font-weight: 700;
                        margin: 0;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    ">${texts.subtitle}</p>
                </div>
            </div>

            <!-- Event Name -->
            <div style="
                background: ${primaryColor};
                color: white;
                padding: 20px 25px;
                border-radius: 18px;
                text-align: center;
                position: relative;
                z-index: 1;
                box-shadow: 0 8px 30px rgba(0,74,153,0.25);
            ">
                <p style="
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin: 0 0 8px 0;
                    opacity: 0.7;
                ">Nome do Evento</p>
                <h2 style="
                    font-size: 22px;
                    font-weight: 900;
                    margin: 0;
                    line-height: 1.3;
                ">${evento.nome}</h2>
            </div>

            <!-- QR Code Section -->
            <div style="
                background: white;
                padding: 25px;
                border-radius: 25px;
                text-align: center;
                position: relative;
                z-index: 1;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                border: 3px solid #f1f5f9;
            ">
                <p style="
                    color: #64748b;
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 20px 0;
                    line-height: 1.5;
                    max-width: 450px;
                    margin-left: auto;
                    margin-right: auto;
                ">${texts.instruction}</p>

                <div style="
                    display: inline-block;
                    padding: 20px;
                    background: white;
                    border: 4px solid ${primaryColor};
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,74,153,0.2);
                ">
                    <img src="${qrCodeDataUrl}" style="
                        width: 240px;
                        height: 240px;
                        display: block;
                    " />
                </div>

                <p style="
                    color: ${primaryColor};
                    font-size: 12px;
                    font-weight: 900;
                    margin: 20px 0 0 0;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                ">📱 Escaneie com a Câmera do Celular</p>
            </div>

            <!-- Footer -->
            <div style="
                text-align: center;
                position: relative;
                z-index: 1;
            ">
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                ">
                    <div style="flex: 1; height: 2px; background: linear-gradient(to right, transparent, ${primaryColor}44, transparent);"></div>
                    <div style="
                        background: ${primaryColor};
                        color: white;
                        padding: 6px 18px;
                        border-radius: 18px;
                        font-size: 11px;
                        font-weight: 900;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    ">${texts.footer}</div>
                    <div style="flex: 1; height: 2px; background: linear-gradient(to left, transparent, ${primaryColor}44, transparent);"></div>
                </div>

                <p style="
                    color: #94a3b8;
                    font-size: 9px;
                    font-weight: 600;
                    margin: 0;
                    line-height: 1.5;
                ">
                    Sistema de Gestão de Eventos UNINASSAU<br/>
                    ${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario} • ${evento.local}
                </p>
            </div>
        </div>
    `;

    await downloadContainerAsImage(container, `qrcode-inscricao-${evento.nome.toLowerCase().replace(/\s+/g, '-')}`, onSuccess);
};

const downloadContainerAsImage = async (container: HTMLElement, fileName: string, onSuccess?: () => void) => {
    document.body.appendChild(container);

    try {
        // Aguardar que todas as imagens sejam carregadas
        const images = container.querySelectorAll('img');
        await Promise.all(
            Array.from(images).map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    // Timeout de segurança
                    setTimeout(resolve, 2000);
                });
            })
        );

        // Aguardar um pouco mais para garantir renderização completa
        await new Promise(resolve => setTimeout(resolve, 300));

        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0, // Sem timeout para imagens
            removeContainer: false // Não remover container automaticamente
        });

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Erro: Blob não gerado');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.png`;
            link.click();

            console.log('✅ QR Code gerado com sucesso:', fileName);

            if (onSuccess) {
                setTimeout(onSuccess, 500);
            }

            setTimeout(() => URL.revokeObjectURL(url), 10000);
        }, 'image/png');
    } catch (error) {
        console.error('❌ Erro ao gerar imagem:', error);
        alert('Erro ao gerar QR Code. Verifique o console para mais detalhes.');
    } finally {
        document.body.removeChild(container);
    }
};

