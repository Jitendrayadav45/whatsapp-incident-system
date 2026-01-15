import { useState } from "react";

export default function ResolutionModal({ isOpen, onClose, onSubmit, loading }) {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notes, setNotes] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!photo) {
      alert("Please upload a resolution photo");
      return;
    }

    // Compress and convert to base64
    compressImage(photo, (base64) => {
      onSubmit({ photo: base64, notes: notes.trim() });
    });
  };

  // Compress image to reduce payload size
  const compressImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if larger than 1920px
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with 0.8 quality for better compression
        const base64 = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
        callback(base64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(8px)"
    }}>
      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "20px",
        padding: "32px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
        border: "1px solid rgba(59, 130, 246, 0.3)"
      }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>✅</span>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#fff" }}>
              Resolve Ticket
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>
            Upload a photo showing the resolved issue (required)
          </p>
        </div>

        {/* Photo Upload */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            fontSize: 14, 
            fontWeight: 600, 
            color: "#93c5fd", 
            marginBottom: 12 
          }}>
            📷 Resolution Photo <span style={{ color: "#ef4444" }}>*</span>
          </label>

          {!photoPreview ? (
            <label style={{
              display: "block",
              border: "2px dashed rgba(59, 130, 246, 0.3)",
              borderRadius: "12px",
              padding: "40px 20px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              background: "rgba(59, 130, 246, 0.05)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.6)";
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
              e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
            }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
                disabled={loading}
              />
              <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#60a5fa", marginBottom: 8 }}>
                Click to upload photo
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>
                PNG, JPG up to 5MB
              </div>
            </label>
          ) : (
            <div style={{ position: "relative" }}>
              <img 
                src={photoPreview} 
                alt="Resolution preview" 
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  maxHeight: "300px",
                  objectFit: "contain",
                  background: "rgba(0, 0, 0, 0.3)"
                }}
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={loading}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(239, 68, 68, 0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 18,
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Notes (Optional) */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ 
            display: "block", 
            fontSize: 14, 
            fontWeight: 600, 
            color: "#93c5fd", 
            marginBottom: 12 
          }}>
            📝 Resolution Notes <span style={{ fontSize: 12, color: "#64748b" }}>(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe how the issue was resolved..."
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "14px",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
              color: "#e2e8f0",
              fontSize: 14,
              resize: "vertical",
              fontFamily: "inherit"
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              background: "rgba(100, 116, 139, 0.2)",
              border: "1px solid rgba(100, 116, 139, 0.3)",
              borderRadius: "12px",
              color: "#cbd5e1",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !photo}
            style={{
              flex: 1,
              padding: "14px",
              background: loading || !photo
                ? "rgba(100, 116, 139, 0.3)"
                : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !photo ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading || !photo ? 0.5 : 1,
              boxShadow: loading || !photo ? "none" : "0 4px 12px rgba(34, 197, 94, 0.4)"
            }}
          >
            {loading ? "Uploading..." : "Mark as Resolved"}
          </button>
        </div>

        {/* Required Field Notice */}
        {!photo && (
          <div style={{
            marginTop: 16,
            padding: "12px",
            background: "rgba(251, 191, 36, 0.1)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: "8px",
            fontSize: 13,
            color: "#fbbf24",
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span>⚠️</span>
            <span>Resolution photo is mandatory to resolve the ticket</span>
          </div>
        )}
      </div>
    </div>
  );
}
