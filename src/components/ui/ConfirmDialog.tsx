
import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    children?: React.ReactNode;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'info',
    children
}) => {
    const getIcon = () => {
        switch (type) {
            case 'danger': return 'report';
            case 'warning': return 'warning';
            default: return 'help';
        }
    };

    const getColorClass = () => {
        switch (type) {
            case 'danger': return 'text-red-600 bg-red-50';
            case 'warning': return 'text-amber-600 bg-amber-50';
            default: return 'text-primary bg-primary/5';
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'danger': return 'bg-red-600 hover:bg-red-700 shadow-red-100';
            case 'warning': return 'bg-amber-600 hover:bg-amber-700 shadow-amber-100';
            default: return 'bg-primary hover:bg-primary-dark shadow-primary/20';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center text-center">
                <div className={`size-16 rounded-full flex items-center justify-center mb-6 ${getColorClass()}`}>
                    <span className="material-symbols-outlined text-3xl">{getIcon()}</span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{title}</h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                    {message}
                </p>

                {children}

                <div className="grid grid-cols-2 gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all shadow-lg ${getButtonClass()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
