import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            <input
                className={`w-full border-2 rounded-2xl p-4 text-sm font-bold transition-all outline-none 
          ${error
                        ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200'
                        : 'border-gray-100 bg-gray-50/30 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white'
                    } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>
            )}
        </div>
    );
};
