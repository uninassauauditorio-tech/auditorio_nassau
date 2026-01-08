import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    fullWidth?: boolean;
    icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "py-4 rounded-xl font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1",
        secondary: "bg-white text-gray-700 border-2 border-gray-100 hover:bg-gray-50",
        outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
        danger: "bg-red-50 text-red-600 border-2 border-red-50 hover:bg-red-100"
    };

    const disabledStyles = "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:transform-none";

    return (
        <button
            className={`${baseStyles} ${fullWidth ? 'w-full' : ''} ${disabled || isLoading ? disabledStyles : variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    PROCESSANDO...
                </>
            ) : (
                <>
                    {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};
