import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ children, onClose }) => {
  const elRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    document.body.appendChild(elRef.current);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.removeChild(elRef.current);
    };

    // const modalRoot = document.getElementById('modal');
    // modalRoot.appendChild(elRef.current);
    // return () => modalRoot.removeChild(elRef.current);
  }, [onClose]);

  // return createPortal(<div>{children}</div>, elRef.current);
  return createPortal(
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="modal-close-btn"
        >
          x
        </button>
        {children}
      </div>
    </div>,
    elRef.current
  );
};

export default Modal;
