import React, { useEffect } from 'react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizes[size]}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-2">{children}</div>
          </div>
          {footer && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', isLoading = false, isDestructive = false }) => {
  const footer = (
    <>
      <Button 
        onClick={onConfirm} 
        isLoading={isLoading} 
        variant={isDestructive ? 'danger' : 'primary'} 
        className="w-full sm:ml-3 sm:w-auto"
      >
        {confirmText}
      </Button>
      <Button 
        onClick={onClose} 
        variant="secondary" 
        className="mt-3 w-full sm:mt-0 sm:w-auto"
      >
        {cancelText}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </Modal>
  );
};

export default Modal;
