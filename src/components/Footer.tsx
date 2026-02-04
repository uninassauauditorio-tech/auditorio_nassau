import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-white border-t py-8 mt-12 no-print">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm font-normal">
          © {new Date().getFullYear()} UNINASSAU. {t('rights_reserved')}
        </p>
        <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest">
          {t('developed_by')} Edgar Tavares.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
