import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Evento, Inscrito } from '../types';
import logo from '../assets/img/logo.png';

export const generateReceipt = async (evento: Evento, inscrito: Inscrito) => {
    const qrCodeDataUrl = await QRCode.toDataURL(inscrito.qrToken, {
        margin: 1,
        width: 200,
        color: {
            dark: '#004A99',
            light: '#FFFFFF'
        }
    });

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const primaryColor = '#004A99';
    const secondaryColor = '#333333';
    const lightGray = '#F9FAFB';

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    try {
        doc.addImage(logo, 'PNG', 15, 10, 45, 20);
    } catch (e) {
        doc.setTextColor('#FFFFFF');
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('UNINASSAU', 15, 25);
    }

    doc.setTextColor('#FFFFFF');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPROVANTE DE INSCRIÇÃO', 195, 25, { align: 'right' });

    // Body
    doc.setTextColor(secondaryColor);
    let y = 55;

    const addField = (label: string, value: string) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor('#999999');
        doc.text(label.toUpperCase(), 20, y);
        y += 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(secondaryColor);
        doc.text(value, 20, y);
        y += 10;
    };

    addField('Participante', inscrito.nomeCompleto.toUpperCase());
    addField('CPF', inscrito.cpf);
    addField('Evento', evento.nome);
    addField('Data do Evento', `${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario}`);
    addField('Local', evento.local);

    // QR Code
    const qrY = y + 5;
    doc.addImage(qrCodeDataUrl, 'PNG', 85, qrY, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryColor);
    doc.text('APRESENTE ESTE QR CODE NA ENTRADA', 105, qrY + 43, { align: 'center' });
    y = qrY + 50;

    doc.setFillColor(lightGray);
    doc.roundedRect(80, y, 50, 15, 3, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor('#666666');
    doc.text('VALIDADO PELO SISTEMA', 105, y + 9, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor('#999999');
    doc.text('Este comprovante deverá ser apresentado na entrada para validação de presença.', 105, 280, { align: 'center' });
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 287, { align: 'center' });

    doc.save(`comprovante-${inscrito.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};
