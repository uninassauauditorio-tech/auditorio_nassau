import React from 'react';
import { useLanguage, Language } from '../hooks/useLanguage';

import ptFlag from '../assets/img/brasil.webp';
import enFlag from '../assets/img/ingles.avif';
import esFlag from '../assets/img/espanha.png';

export const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const languages: { code: Language; flag: string; label: string }[] = [
        { code: 'pt', flag: ptFlag, label: 'PT' },
        { code: 'en', flag: enFlag, label: 'EN' },
        { code: 'es', flag: esFlag, label: 'ES' }
    ];

    return (
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${language === lang.code
                        ? 'bg-white text-primary shadow-lg scale-105'
                        : 'text-white hover:bg-white/10'
                        }`}
                >
                    <img src={lang.flag} alt={lang.label} className="w-5 h-3.5 object-cover rounded-[2px]" />
                    <span className="text-[10px] font-black tracking-tighter">{lang.label}</span>
                </button>
            ))}
        </div>
    );
};
