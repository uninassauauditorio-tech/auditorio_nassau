
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white w-full ${maxWidth} rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200`}>
                {title && (
                    <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{title}</h3>
                        <button
                            onClick={onClose}
                            className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                )}

                <div className="px-8 pb-8 pt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
