import React, { useState, useEffect } from "react";
import "./pay.css"; // For styling
import dollarImage from "./assets/dollar.png"; // Adjust path if necessary

const Modal = ({ show, onClose }) => {
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (show) {
      setLoading(true); // Start loading when modal is shown
      setTimeout(() => {
        setLoading(false); // Stop loading after 1 second
      }, 3000); // 1 second delay
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <img src={dollarImage} alt="Dollar Icon" className="shake" />
        <h2 style={{ color: "#4FBA6F", marginBottom: "10px" }}>
          {loading ? "Processing Payment..." : "Payment Completed!"}
        </h2>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
