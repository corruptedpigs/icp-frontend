"use client";

import { useEffect } from 'react';

const ModalTimeIsUp = ({ isOpen, onClose, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-2xl mb-4">{message}</h2>
        <div className="text-4xl">⌛</div> {/* Emoticon */}
        <button onClick={onClose} className="btn btn-primary mt-4">Close</button>
      </div>
    </div>
  );
};

export default ModalTimeIsUp;
