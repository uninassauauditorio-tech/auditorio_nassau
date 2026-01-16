import QRCode from 'qrcode';
import { Evento, Inscrito } from '../types';

export const generateReceipt = async (evento: Evento, inscrito: Inscrito, onSuccess?: () => void) => {
    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(inscrito.qrToken, {
        margin: 1,
        width: 400,
        color: {
            dark: '#004a99',
            light: '#ffffff'
        }
    });

    const primaryColor = '#004a99';
    const secondaryColor = '#333333';
    const lightGray = '#f3f4f6';

    // Create a receipt container in the DOM
    const container = document.createElement('div');
    container.style.cssText = `
        width: 595px;
        height: 842px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: Arial, Helvetica, sans-serif;
        padding: 40px;
        box-sizing: border-box;
    `;

    const title = inscrito.checkedIn ? 'CERTIFICADO DE PRESENÇA' : 'COMPROVANTE DE INSCRIÇÃO';
    const fileName = inscrito.checkedIn ? 'certificado' : 'comprovante';
    const statusText = inscrito.checkedIn ? 'PRESENÇA VALIDADA' : 'VALIDADO PELO SISTEMA';
    const footerText = inscrito.checkedIn
        ? 'Este documento certifica a presença do participante no evento acima citado.'
        : 'Este comprovante deverá ser apresentado na entrada para validação de presença.';

    container.innerHTML = `
        <div style="border: 4px solid ${primaryColor}; border-radius: 20px; padding: 30px; height: 100%; box-sizing: border-box; position: relative;">
            <!-- Header -->
            <div style="background: ${primaryColor}; margin: -30px -30px 30px -30px; padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 2px;">UNINASSAU</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${title}</p>
            </div>

            <!-- Event Name -->
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0; text-transform: uppercase;">${evento.nome}</h2>
            </div>

            <!-- Participant Info -->
            <div style="margin-bottom: 20px;">
                <div style="margin-bottom: 15px;">
                    <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase;">Participante</p>
                    <p style="color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0; text-transform: uppercase;">${inscrito.nomeCompleto}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase;">CPF</p>
                    <p style="color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${inscrito.cpf}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase;">Evento</p>
                    <p style="color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${evento.nome}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase;">Data do Evento</p>
                    <p style="color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase;">Local</p>
                    <p style="color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${evento.local}</p>
                </div>
                ${inscrito.checkedIn && inscrito.checkinDate ? `
                <div style="margin-bottom: 15px;">
                    <p style="color: #999; font-size: 12px; margin: 0; text-transform: uppercase;">Data/Hora da Presença</p>
                    <p style="color: ${secondaryColor}; font-size: 18px; font-weight: bold; margin: 5px 0 0 0;">${new Date(inscrito.checkinDate).toLocaleString('pt-BR')}</p>
                </div>
                ` : ''}
            </div>

            <!-- QR Code -->
            <div style="text-align: center; margin: 30px 0;">
                <img src="${qrCodeDataUrl}" style="width: 150px; height: 150px; border: 3px solid ${primaryColor}; border-radius: 10px;" />
                <p style="color: ${primaryColor}; font-size: 12px; font-weight: bold; margin: 10px 0 0 0; text-transform: uppercase;">Apresente este QR Code na entrada</p>
            </div>

            <!-- Status Badge -->
            <div style="background: ${lightGray}; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0;">
                <p style="color: #666; font-size: 14px; font-weight: bold; margin: 0; text-transform: uppercase;">${statusText}</p>
            </div>

            <!-- Footer -->
            <div style="position: absolute; bottom: 30px; left: 30px; right: 30px; text-align: center;">
                <p style="color: #999; font-size: 12px; font-style: italic; margin: 0;">${footerText}</p>
                <p style="color: #999; font-size: 12px; font-style: italic; margin: 5px 0 0 0;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;

    // Convert to canvas
    const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
    });

    // Remove container from DOM
    document.body.removeChild(container);

    // Convert canvas to PNG
    canvas.toBlob(async (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}-${inscrito.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}.png`;

        // Download the file
        link.click();

        // Call success callback to show modal
        if (onSuccess) {
            setTimeout(onSuccess, 500);
        }

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, 'image/png');
};
