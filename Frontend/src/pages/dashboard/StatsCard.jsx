export default function StatsCard({ title, value, icon, gradient, subtitle }) {
  return (
    <div 
      className="card premium-stats-card" 
      style={{ 
        position: "relative",
        padding: 28,
        background: gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
        e.currentTarget.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)";
        const bg = e.currentTarget.querySelector('.stats-bg-decoration');
        if (bg) {
          bg.style.transform = "translate(10px, 10px) scale(1.1) rotate(10deg)";
          bg.style.opacity = "0.3";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
        const bg = e.currentTarget.querySelector('.stats-bg-decoration');
        if (bg) {
          bg.style.transform = "translate(0, 0) scale(1) rotate(0deg)";
          bg.style.opacity = "0.2";
        }
      }}
    >
      {/* Background decoration with animation */}
      <div 
        className="stats-bg-decoration"
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          fontSize: 120,
          opacity: 0.2,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
        }}
      >
        {icon || "📊"}
      </div>

      {/* Glowing effect */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
        animation: "shimmer 3s ease-in-out infinite"
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ 
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: 16
        }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <div style={{ 
            fontSize: 13, 
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.95)",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            {title}
          </div>
        </div>
        <div style={{ 
          fontSize: 42, 
          fontWeight: 800, 
          color: "#fff",
          marginBottom: subtitle ? 8 : 0,
          textShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          lineHeight: 1
        }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ 
            fontSize: 13, 
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 500,
            marginTop: 8,
            padding: "6px 12px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "6px",
            display: "inline-block"
          }}>
            {subtitle}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}