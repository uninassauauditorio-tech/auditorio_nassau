
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-8 mt-12 no-print">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm font-normal">
          © 2025 UNINASSAU. Todos os direitos reservados.
        </p>
        <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest">
          Desenvolvido por Edgar Tavares.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
