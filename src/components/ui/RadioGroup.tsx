import React from 'react';

interface RadioOption {
    value: string;
    label: string;
}

interface RadioGroupProps {
    label: string;
    name: string;
    options: RadioOption[] | string[];
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, value, onChange, required }) => {
    return (
        <div className="p-5 bg-primary-light/50 rounded-2xl border border-primary/10 animate-in">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">{label}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                {options.map((opt) => {
                    const optValue = typeof opt === 'string' ? opt : opt.value;
                    const optLabel = typeof opt === 'string' ? opt : opt.label;

                    return (
                        <label key={optValue} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name={name}
                                required={required}
                                className="size-4 accent-primary"
                                value={optValue}
                                checked={value === optValue}
                                onChange={(e) => onChange(e.target.value)}
                            />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">
                                {optLabel}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};
