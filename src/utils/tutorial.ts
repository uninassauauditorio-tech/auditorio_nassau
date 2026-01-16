import QRCode from 'qrcode';

export const generateTutorial = async (onSuccess?: () => void) => {
    const primaryColor = '#004a99';
    const secondaryColor = '#333333';

    // Create tutorial container
    const container = document.createElement('div');
    container.style.cssText = `
        width: 800px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: Arial, Helvetica, sans-serif;
        padding: 50px;
        box-sizing: border-box;
    `;

    container.innerHTML = `
        <!-- Header com Logo -->
        <div style="background: ${primaryColor}; padding: 40px; border-radius: 20px; text-align: center; margin-bottom: 40px;">
            <h1 style="color: white; margin: 0; font-size: 48px; font-weight: bold; letter-spacing: 3px;">UNINASSAU</h1>
            <p style="color: white; margin: 15px 0 0 0; font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Tutorial de Inscrição em Eventos</p>
        </div>

        <!-- Intro -->
        <div style="text-align: center; margin-bottom: 50px;">
            <h2 style="color: ${primaryColor}; font-size: 28px; font-weight: bold; margin: 0 0 10px 0;">Como se Inscrever em um Evento?</h2>
            <p style="color: #666; font-size: 16px; margin: 0;">Siga este passo a passo simples e rápido</p>
        </div>

        <!-- Passo 1 -->
        <div style="display: flex; align-items: flex-start; margin-bottom: 35px; padding: 25px; background: #f8f9fa; border-radius: 15px; border-left: 5px solid ${primaryColor};">
            <div style="background: ${primaryColor}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; flex-shrink: 0; margin-right: 20px;">1</div>
            <div style="flex: 1;">
                <h3 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">Escolha o Evento</h3>
                <p style="color: ${secondaryColor}; font-size: 16px; margin: 0; line-height: 1.6;">Navegue pela lista de eventos disponíveis e clique em <strong>"Ver Detalhes"</strong> no evento que deseja participar.</p>
            </div>
        </div>

        <!-- Passo 2 -->
        <div style="display: flex; align-items: flex-start; margin-bottom: 35px; padding: 25px; background: #f8f9fa; border-radius: 15px; border-left: 5px solid ${primaryColor};">
            <div style="background: ${primaryColor}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; flex-shrink: 0; margin-right: 20px;">2</div>
            <div style="flex: 1;">
                <h3 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">Clique em "Inscrever-se"</h3>
                <p style="color: ${secondaryColor}; font-size: 16px; margin: 0; line-height: 1.6;">Na página de detalhes do evento, clique no botão azul <strong>"Inscrever-se"</strong> para iniciar seu cadastro.</p>
            </div>
        </div>

        <!-- Passo 3 -->
        <div style="display: flex; align-items: flex-start; margin-bottom: 35px; padding: 25px; background: #f8f9fa; border-radius: 15px; border-left: 5px solid ${primaryColor};">
            <div style="background: ${primaryColor}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; flex-shrink: 0; margin-right: 20px;">3</div>
            <div style="flex: 1;">
                <h3 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">Preencha seus Dados</h3>
                <p style="color: ${secondaryColor}; font-size: 16px; margin: 0 0 8px 0; line-height: 1.6;">Complete o formulário com suas informações:</p>
                <ul style="color: ${secondaryColor}; font-size: 15px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Nome Completo</li>
                    <li>CPF</li>
                    <li>Telefone</li>
                    <li>E-mail</li>
                    <li>Escolaridade</li>
                    <li>Interesse em Graduação (se aplicável)</li>
                    <li>Curso de Interesse (obrigatório se tem interesse)</li>
                </ul>
            </div>
        </div>

        <!-- Passo 4 -->
        <div style="display: flex; align-items: flex-start; margin-bottom: 35px; padding: 25px; background: #f8f9fa; border-radius: 15px; border-left: 5px solid ${primaryColor};">
            <div style="background: ${primaryColor}; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; flex-shrink: 0; margin-right: 20px;">4</div>
            <div style="flex: 1;">
                <h3 style="color: ${primaryColor}; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">Confirme sua Inscrição</h3>
                <p style="color: ${secondaryColor}; font-size: 16px; margin: 0; line-height: 1.6;">Revise seus dados e clique em <strong>"Confirmar Inscrição"</strong>. Aguarde a confirmação de sucesso.</p>
            </div>
        </div>

        <!-- Passo 5 -->
        <div style="display: flex; align-items: flex-start; margin-bottom: 35px; padding: 25px; background: #d4edda; border-radius: 15px; border-left: 5px solid #28a745;">
            <div style="background: #28a745; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: bold; flex-shrink: 0; margin-right: 20px;">5</div>
            <div style="flex: 1;">
                <h3 style="color: #28a745; font-size: 20px; font-weight: bold; margin: 0 0 10px 0;">Baixe seu Comprovante</h3>
                <p style="color: ${secondaryColor}; font-size: 16px; margin: 0; line-height: 1.6;">Após a confirmação, clique em <strong>"Baixar Comprovante"</strong>. Este comprovante em PNG será necessário na entrada do evento!</p>
            </div>
        </div>

        <!-- Observação Importante -->
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 15px; padding: 20px; text-align: center; margin-top: 40px;">
            <h4 style="color: #856404; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">⚠️ IMPORTANTE</h4>
            <p style="color: #856404; font-size: 15px; margin: 0; line-height: 1.6;">
                📱 <strong>No celular:</strong> O comprovante ficará na <strong>Galeria de Fotos</strong> ou pasta <strong>Downloads</strong><br>
                💻 <strong>No computador:</strong> O comprovante ficará na pasta <strong>Downloads</strong><br><br>
                Apresente este comprovante na portaria do evento para validar sua presença!
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px solid #e9ecef;">
            <p style="color: #666; font-size: 14px; margin: 0;">Sistema de Eventos UNINASSAU</p>
            <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
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

    // Remove container
    document.body.removeChild(container);

    // Convert to PNG
    canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tutorial-inscricao-uninassau.png';
        link.click();

        // Call success callback
        if (onSuccess) {
            setTimeout(onSuccess, 500);
        }

        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }, 'image/png');
};
