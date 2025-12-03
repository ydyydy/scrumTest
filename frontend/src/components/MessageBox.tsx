import { useState, useEffect } from "react";

interface MessageBoxProps {
  message: string;
  success?: boolean;
  duration?: number; // tiempo para autodesaparecer
}

export function MessageBox({
  message,
  success = true,
  duration = 3000,
}: MessageBoxProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible || !message) return null;

  return (
    <div className="d-flex justify-content-center mt-3">
      <div
        className={`alert alert-${
          success ? "success" : "danger"
        } d-flex justify-content-between align-items-center p-2`}
        style={{
          minWidth: "200px",
          maxWidth: "400px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <span style={{ fontSize: "0.9rem" }}>{message}</span>
        <button
          type="button"
          className="btn-close btn-close-white btn-sm"
          aria-label="Close"
          onClick={() => setVisible(false)}
        ></button>
      </div>
    </div>
  );
}
