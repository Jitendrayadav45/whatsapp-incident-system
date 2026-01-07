import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { generateSiteQR, generateSubSiteQR } from "../../api/sites.api";

export default function QRCodeModal({ site, subSite, onClose }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQRCode();
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [site, subSite]);

  async function loadQRCode() {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (subSite) {
        response = await generateSubSiteQR(site.siteId, subSite.subSiteId);
      } else {
        response = await generateSiteQR(site.siteId);
      }
      
      setQrData(response.data);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qrData?.qrDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrData.qrDataUrl;
    link.download = `QR_${site.siteId}${subSite ? `_${subSite.subSiteId}` : ''}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function copyWhatsAppLink() {
    if (!qrData?.waLink) return;
    
    navigator.clipboard.writeText(qrData.waLink).then(() => {
      alert('✅ WhatsApp link copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy link');
    });
  }

  const modalContent = (
    <div 
      className="qr-modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        animation: "fadeIn 0.3s ease",
        padding: "40px 20px",
        overflowY: "auto"
      }}
      onClick={onClose}
    >
      <div 
        className="qr-modal-content"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "2px solid rgba(59, 130, 246, 0.4)",
          borderRadius: 28,
          padding: "2.5rem",
          maxWidth: 600,
          width: "100%",
          maxHeight: "95vh",
          overflowY: "auto",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 100px rgba(59, 130, 246, 0.2)",
          animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          margin: "auto",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)"
            }}>
              📱
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
                WhatsApp QR Code
              </h3>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.6)" }}>
                Scan to report issues
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#fca5a5",
              fontSize: "1.25rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </button>
        </div>

        {/* Location Info */}
        <div style={{
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "1.5rem"
        }}>
          <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.7)", marginBottom: "0.5rem" }}>
            📍 Location Details
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 600, color: "#93c5fd" }}>
            🏭 {site.siteName} ({site.siteId})
          </div>
          {subSite && (
            <div style={{ fontSize: "1rem", fontWeight: 600, color: "#c4b5fd", marginTop: "0.25rem" }}>
              🏗 {subSite.subSiteName} ({subSite.subSiteId})
            </div>
          )}
        </div>

        {/* QR Code Display */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          {loading && (
            <div style={{
              width: 350,
              height: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(15, 23, 42, 0.6)",
              borderRadius: "16px",
              border: "2px dashed rgba(59, 130, 246, 0.3)"
            }}>
              <div style={{
                width: 50,
                height: 50,
                border: "4px solid rgba(59, 130, 246, 0.2)",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
            </div>
          )}

          {error && (
            <div style={{
              width: 350,
              height: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "1rem",
              background: "rgba(239, 68, 68, 0.1)",
              borderRadius: "16px",
              border: "2px dashed rgba(239, 68, 68, 0.3)",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "3rem" }}>⚠️</div>
              <div style={{ color: "#fca5a5", fontSize: "0.875rem" }}>{error}</div>
              <button
                onClick={loadQRCode}
                style={{
                  padding: "0.5rem 1rem",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && qrData && (
            <div style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "20px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.2)"
            }}>
              <img 
                src={qrData.qrDataUrl} 
                alt="QR Code" 
                style={{
                  width: 350,
                  height: 350,
                  display: "block"
                }}
              />
            </div>
          )}

          {!loading && !error && qrData && (
            <div style={{
              marginTop: "1.25rem",
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "center",
              fontWeight: 500
            }}>
              📷 Scan with your phone camera to report issues
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!loading && !error && qrData && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem"
          }}>
            <button
              onClick={downloadQR}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.5rem",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
              }}
            >
              <span>⬇️</span>
              <span>Download</span>
            </button>

            <button
              onClick={copyWhatsAppLink}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.875rem 1.5rem",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
              }}
            >
              <span>📋</span>
              <span>Copy Link</span>
            </button>
          </div>
        )}

        {/* Help Text */}
        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "rgba(139, 92, 246, 0.1)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          borderRadius: "12px",
          fontSize: "0.8125rem",
          color: "rgba(255, 255, 255, 0.7)",
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 600, color: "#c4b5fd", marginBottom: "0.5rem" }}>
            💡 How it works:
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            <li>Users scan the QR code with their phone camera</li>
            <li>WhatsApp opens with site/sub-site pre-filled</li>
            <li>They send their report message</li>
            <li>Ticket is created automatically with location info</li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px) saturate(100%);
            -webkit-backdrop-filter: blur(0px) saturate(100%);
          }
          to { 
            opacity: 1;
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .qr-modal-backdrop {
          isolation: isolate;
        }

        .qr-modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .qr-modal-content::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }

        .qr-modal-content::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }

        .qr-modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );

  // Render modal using Portal to ensure it's at the root level
  return createPortal(modalContent, document.body);
}
