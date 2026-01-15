export default function PromptModal({ isOpen, title, message, placeholder, onConfirm, onCancel, confirmText = "Submit", cancelText = "Cancel" }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.promptInput;
    onConfirm(input.value);
  };

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
      <form onSubmit={handleSubmit} style={{
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
            📝
          </span>
          {title}
        </h3>
        
        {message && (
          <p style={{
            margin: "0 0 24px 0",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            {message}
          </p>
        )}

        <textarea
          name="promptInput"
          placeholder={placeholder}
          autoFocus
          required
          rows={4}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            background: "rgba(15, 23, 42, 0.6)",
            color: "#fff",
            fontSize: "0.95rem",
            fontFamily: "inherit",
            resize: "vertical",
            outline: "none",
            transition: "all 0.2s ease",
            marginBottom: "24px"
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.6)";
            e.currentTarget.style.background = "rgba(15, 23, 42, 0.8)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
            e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
          }}
        />

        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            type="button"
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
            type="submit"
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.5)",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)",
              color: "#93c5fd",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.5) 100%)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.8)";
              e.currentTarget.style.color = "#bfdbfe";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)";
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.5)";
              e.currentTarget.style.color = "#93c5fd";
            }}
          >
            {confirmText}
          </button>
        </div>
      </form>

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
