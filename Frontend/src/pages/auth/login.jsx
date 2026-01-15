import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(email, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)",
          animation: "pulse 8s ease-in-out infinite",
        }}
      />

      {/* Floating Bubbles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${Math.random() * 100 + 30}px`,
            height: `${Math.random() * 100 + 30}px`,
            borderRadius: "50%",
            backgroundColor: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            backdropFilter: "blur(2px)",
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          backgroundImage: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
          animation: "morphing 20s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "250px",
          height: "250px",
          borderRadius: "63% 37% 54% 46% / 55% 48% 52% 45%",
          backgroundImage: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(236, 72, 153, 0.15))",
          animation: "morphing 25s ease-in-out infinite reverse",
          filter: "blur(50px)",
        }}
      />

      <style>
        {`
          @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0) rotate(0deg);
            }
            33% {
              transform: translateY(-30px) translateX(20px) rotate(120deg);
            }
            66% {
              transform: translateY(-15px) translateX(-20px) rotate(240deg);
            }
          }
          @keyframes morphing {
            0%, 100% {
              border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
              transform: rotate(0deg) scale(1);
            }
            25% {
              border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
              transform: rotate(90deg) scale(1.1);
            }
            50% {
              border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
              transform: rotate(180deg) scale(1);
            }
            75% {
              border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
              transform: rotate(270deg) scale(1.1);
            }
          }
          @keyframes slideInFromTop {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>

      {/* Login Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "0 20px",
          animation: "slideInFromTop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Premium Card Container */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)",
            borderRadius: "28px",
            padding: "52px 48px",
            boxShadow: "0 30px 70px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(30px) saturate(150%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.background = `
              radial-gradient(circle 600px at ${x}px ${y}px, rgba(59, 130, 246, 0.15), transparent),
              linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)";
          }}
        >
          {/* Top shimmer effect */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              right: "-100%",
              height: "3px",
              background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.9), rgba(139, 92, 246, 0.9), transparent)",
              animation: "shimmer 4s infinite",
            }}
          />

          {/* Corner decorations */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent)",
              filter: "blur(20px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)",
              filter: "blur(25px)",
            }}
          />

          {/* Logo/Icon Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "36px",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                boxShadow: "0 15px 40px -10px rgba(59, 130, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)",
                animation: "iconPulse 3s ease-in-out infinite",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
                  animation: "shimmer 3s infinite",
                }}
              />
              💬
            </div>
          </div>

          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "42px",
            }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #60a5fa, #a78bfa, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "12px",
                letterSpacing: "-1px",
                textShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: "17px",
                color: "#cbd5e1",
                fontWeight: "600",
                letterSpacing: "0.3px",
                marginBottom: "6px",
              }}
            >
              WhatsApp Incident Reporting System
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
                borderRadius: "20px",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                fontSize: "13px",
                color: "#a78bfa",
                fontWeight: "600",
                marginTop: "4px",
              }}
            >
              🔐 Admin Panel
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
            {/* Email Input */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: emailFocused ? "#60a5fa" : "#94a3b8",
                  transition: "color 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "22px",
                    pointerEvents: "none",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                    filter: emailFocused ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : "none",
                  }}
                >
                  📧
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    padding: "18px 18px 18px 56px",
                    fontSize: "16px",
                    color: "#f1f5f9",
                    background: emailFocused
                      ? "rgba(15, 23, 42, 0.8)"
                      : "rgba(15, 23, 42, 0.5)",
                    border: emailFocused
                      ? "2px solid #3b82f6"
                      : "2px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "14px",
                    outline: "none",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: emailFocused
                      ? "0 0 0 4px rgba(59, 130, 246, 0.15), 0 10px 30px -5px rgba(59, 130, 246, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                      : "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                    fontWeight: "500",
                  }}
                />
                {emailFocused && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "0",
                      right: "0",
                      height: "2px",
                      background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Password Input */}
            <div style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: passwordFocused ? "#a78bfa" : "#94a3b8",
                  transition: "color 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "22px",
                    pointerEvents: "none",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                    filter: passwordFocused ? "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))" : "none",
                  }}
                >
                  🔒
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "18px 56px 18px 56px",
                    fontSize: "16px",
                    color: "#f1f5f9",
                    background: passwordFocused
                      ? "rgba(15, 23, 42, 0.8)"
                      : "rgba(15, 23, 42, 0.5)",
                    border: passwordFocused
                      ? "2px solid #8b5cf6"
                      : "2px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "14px",
                    outline: "none",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: passwordFocused
                      ? "0 0 0 4px rgba(139, 92, 246, 0.15), 0 10px 30px -5px rgba(139, 92, 246, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                      : "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                    fontWeight: "500",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: passwordFocused
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(148, 163, 184, 0.1)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1.15)";
                    e.currentTarget.style.background = "rgba(139, 92, 246, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                    e.currentTarget.style.background = passwordFocused
                      ? "rgba(139, 92, 246, 0.2)"
                      : "rgba(148, 163, 184, 0.1)";
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
                {passwordFocused && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "0",
                      right: "0",
                      height: "2px",
                      background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "-8px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    accentColor: "#3b82f6",
                  }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                    fontWeight: "500",
                  }}
                >
                  Remember me
                </span>
              </label>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "4px 8px",
                  borderRadius: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#3b82f6";
                  e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#60a5fa";
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: "16px 18px",
                  background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))",
                  border: "2px solid rgba(239, 68, 68, 0.4)",
                  borderRadius: "12px",
                  color: "#fca5a5",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: "fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.2)",
                  fontWeight: "500",
                }}
              >
                <span style={{ fontSize: "20px" }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "18px",
                fontSize: "17px",
                fontWeight: "700",
                color: "#ffffff",
                backgroundImage: loading
                  ? "linear-gradient(135deg, #64748b, #475569)"
                  : "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
                backgroundSize: "200% 100%",
                border: "none",
                borderRadius: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: loading
                  ? "none"
                  : "0 15px 35px -5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                position: "relative",
                overflow: "hidden",
                opacity: loading ? 0.7 : 1,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                  e.currentTarget.style.backgroundPosition = "100% 0";
                  e.currentTarget.style.boxShadow =
                    "0 20px 45px -5px rgba(59, 130, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.5), 0 0 50px rgba(236, 72, 153, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.backgroundPosition = "0% 0";
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px -5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                }
              }}
              onClick={(e) => {
                if (!loading) {
                  // Ripple effect
                  const ripple = document.createElement("span");
                  const rect = e.currentTarget.getBoundingClientRect();
                  const size = Math.max(rect.width, rect.height);
                  const x = e.clientX - rect.left - size / 2;
                  const y = e.clientY - rect.top - size / 2;
                  
                  ripple.style.width = ripple.style.height = size + "px";
                  ripple.style.left = x + "px";
                  ripple.style.top = y + "px";
                  ripple.style.position = "absolute";
                  ripple.style.borderRadius = "50%";
                  ripple.style.background = "rgba(255, 255, 255, 0.5)";
                  ripple.style.animation = "ripple 0.6s ease-out";
                  ripple.style.pointerEvents = "none";
                  
                  e.currentTarget.appendChild(ripple);
                  setTimeout(() => ripple.remove(), 600);
                }
              }}
            >
              {/* Button shine effect */}
              {!loading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)",
                    animation: "shimmer 3s infinite",
                    pointerEvents: "none",
                  }}
                />
              )}
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      border: "3px solid rgba(255, 255, 255, 0.3)",
                      borderTopColor: "#ffffff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", position: "relative" }}>
                  <span>Sign In to Dashboard</span>
                  <span style={{ fontSize: "20px", transition: "transform 0.3s ease" }}>→</span>
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div
            style={{
              marginTop: "36px",
              paddingTop: "28px",
              borderTop: "1px solid rgba(148, 163, 184, 0.15)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)",
                  animation: "iconPulse 2s ease-in-out infinite",
                }}
              />
              <p
                style={{
                  fontSize: "14px",
                  color: "#94a3b8",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "18px" }}>🔐</span>
                Secured Admin Access
              </p>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "8px",
              }}
            >
              Protected by end-to-end encryption
            </p>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "250px",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(60px)",
            animation: "pulse 6s ease-in-out infinite",
          }}
        />
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}