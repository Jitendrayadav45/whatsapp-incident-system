import { useState, useEffect } from "react";

let toastId = 0;

export default function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: {
      bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)",
      border: "rgba(16, 185, 129, 0.5)",
      text: "#6ee7b7",
      icon: "✅"
    },
    error: {
      bg: "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(153, 27, 27, 0.2) 100%)",
      border: "rgba(248, 113, 113, 0.5)",
      text: "#fca5a5",
      icon: "❌"
    },
    warning: {
      bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)",
      border: "rgba(251, 191, 36, 0.5)",
      text: "#fcd34d",
      icon: "⚠️"
    },
    info: {
      bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%)",
      border: "rgba(59, 130, 246, 0.5)",
      text: "#93c5fd",
      icon: "ℹ️"
    }
  };

  const style = colors[type] || colors.info;

  return (
    <div style={{
      position: "fixed",
      top: "24px",
      right: "24px",
      zIndex: 10000,
      minWidth: "320px",
      maxWidth: "500px",
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: "12px",
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: visible ? "slideInRight 0.3s ease" : "slideOutRight 0.3s ease",
      opacity: visible ? 1 : 0
    }}>
      <span style={{ fontSize: "24px" }}>{style.icon}</span>
      <span style={{
        flex: 1,
        color: style.text,
        fontSize: "0.95rem",
        fontWeight: 500,
        lineHeight: 1.5
      }}>
        {message}
      </span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: style.text,
          fontSize: "1.2rem",
          cursor: "pointer",
          opacity: 0.7,
          transition: "opacity 0.2s ease",
          padding: "4px"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
      >
        ×
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

// Toast container to manage multiple toasts
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    window.showToast = (message, type = "info", duration = 3000) => {
      const id = ++toastId;
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: "fixed",
            top: `${24 + index * 80}px`,
            right: "24px",
            zIndex: 10000
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        </div>
      ))}
    </>
  );
}
