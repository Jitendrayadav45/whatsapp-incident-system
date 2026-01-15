export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", danger = false }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "500px",
        width: "90%",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        animation: "slideUp 0.3s ease"
      }}>
        <h3 style={{
          margin: "0 0 16px 0",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{
            fontSize: "28px",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
          }}>
            {danger ? "⚠️" : "ℹ️"}
          </span>
          {title}
        </h3>
        
        <p style={{
          margin: "0 0 32px 0",
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "rgba(255, 255, 255, 0.8)"
        }}>
          {message}
        </p>

        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(51, 65, 85, 0.3)",
              color: "#cbd5e1",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(51, 65, 85, 0.5)";
              e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(51, 65, 85, 0.3)";
              e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.3)";
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: danger ? "1px solid rgba(248, 113, 113, 0.5)" : "1px solid rgba(59, 130, 246, 0.5)",
              background: danger 
                ? "linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%)"
                : "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)",
              color: danger ? "#fca5a5" : "#93c5fd",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              if (danger) {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.5) 0%, rgba(153, 27, 27, 0.5) 100%)";
                e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.8)";
                e.currentTarget.style.color = "#fecdd3";
              } else {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.5) 100%)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.8)";
                e.currentTarget.style.color = "#bfdbfe";
              }
            }}
            onMouseLeave={(e) => {
              if (danger) {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 100%)";
                e.currentTarget.style.borderColor = "rgba(248, 113, 113, 0.5)";
                e.currentTarget.style.color = "#fca5a5";
              } else {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)";
                e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
                e.currentTarget.style.color = "#93c5fd";
              }
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
