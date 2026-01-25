import React from 'react';

const Modal = ({ isOpen, onClose, title, sub, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modalOverlay show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mh">
          <div>
            <h3>{title}</h3>
            <div className="sub">{sub}</div>
          </div>
          <button className="btn secondary" onClick={onClose}>Close</button>
        </div>
        <div className="mb">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;