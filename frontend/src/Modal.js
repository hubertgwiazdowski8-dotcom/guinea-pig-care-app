import React from 'react';

const Modal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <div style={{ display: "flex", gap: "12px", marginTop: 10 }}>
          <button onClick={onConfirm} style={{
            background: "#c32c2c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: "pointer"
          }}>Yes</button>
          <button onClick={onCancel} style={{
            background: "#ddd",
            color: "#222",
            border: "none",
            borderRadius: "4px",
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: "pointer"
          }}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;