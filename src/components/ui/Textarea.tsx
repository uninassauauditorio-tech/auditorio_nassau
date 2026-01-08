import React, { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {label}
            </label>
            <textarea
                className={`w-full border border-gray-200 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none
          ${error ? 'border-red-300' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>
            )}
        </div>
    );
};
