import React, { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, placeholder, error, className = '', ...props }) => {
    return (
        <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                {label}
            </label>
            <div className="relative">
                <select
                    className={`w-full border-2 rounded-2xl p-4 text-sm font-bold transition-all appearance-none cursor-pointer outline-none
            ${error
                            ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200'
                            : 'border-gray-100 bg-gray-50/30 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white'
                        } ${className}`}
                    {...props}
                >
                    {placeholder && <option value="" disabled className="text-gray-400">{placeholder}</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-gray-900">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <span className="material-symbols-outlined">expand_more</span>
                </div>
            </div>
            {error && (
                <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>
            )}
        </div>
    );
};
