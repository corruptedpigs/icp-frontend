"use client";

import { useEffect, useRef } from 'react';

const ModalTimeIsUp = ({ isOpen, onClose, message }) => {
  const modalCheckboxRef = useRef(null);

  useEffect(() => {
    if (modalCheckboxRef.current) {
      modalCheckboxRef.current.checked = isOpen;
    }
  }, [isOpen]);

  return (
    <>
      <input type="checkbox" id="my_modal_7" className="modal-toggle" ref={modalCheckboxRef} />
      <div className="modal " role="dialog">
        <div className="modal-box w-3/12 bg-slate-700 text-center">
          <h3 className="text-lg font-bold">{message}</h3>
          <p className="text-4xl py-4">⌛</p>
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7" onClick={onClose}>Close</label>
      </div>
    </>
  );
};

export default ModalTimeIsUp;
