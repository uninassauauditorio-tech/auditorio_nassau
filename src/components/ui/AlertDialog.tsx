
import React from 'react';
import Modal from './Modal';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
    type?: 'success' | 'error' | 'info';
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    onClose,
    title,
    message,
    buttonText = 'Entendido',
    type = 'info'
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            default: return 'info';
        }
    };

    const getColorClass = () => {
        switch (type) {
            case 'success': return 'text-green-600 bg-green-50';
            case 'error': return 'text-red-600 bg-red-50';
            default: return 'text-primary bg-primary/5';
        }
    };

    const getButtonClass = () => {
        switch (type) {
            case 'success': return 'bg-green-600 hover:bg-green-700 shadow-green-100';
            case 'error': return 'bg-red-600 hover:bg-red-700 shadow-red-100';
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
                <p className="text-gray-500 font-medium mb-8 leading-relaxed whitespace-pre-wrap">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className={`w-full px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all shadow-lg ${getButtonClass()}`}
                >
                    {buttonText}
                </button>
            </div>
        </Modal>
    );
};

export default AlertDialog;
