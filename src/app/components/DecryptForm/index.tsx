"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { XCircle, AlertCircle, X } from "lucide-react";
import styles from "./styles.module.scss";

interface ToastState {
  show: boolean;
  message: string;
  type: "error" | "warning";
}

export default function DecryptForm() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "error",
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "error" });
    }, 4000);
  };

  const handleReverse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOriginalName("");

    try {
      const response = await fetch("/api/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setOriginalName(data.originalName);
      } else {
        showToast(data.error || "Senha não encontrada", "error");
      }
    } catch (error) {
      showToast("Erro ao processar a requisição", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Descobrir Nome Original</h2>
        <form onSubmit={handleReverse} className={styles.form}>
          <input
            type="text"
            value={generatedPassword}
            onChange={(e) => setGeneratedPassword(e.target.value)}
            placeholder="Cole a senha gerada"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Buscando..." : "Descobrir Nome"}
          </button>
        </form>

        {originalName && (
          <div className={styles.result}>
            <h3>Nome Original:</h3>
            <p className={styles.decrypted}>{originalName}</p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.show &&
        createPortal(
          <div className={styles.toastContainer}>
            <div className={`${styles.toast} ${styles[toast.type]}`}>
              <div className={styles.toastIcon}>
                {toast.type === "error" ? (
                  <XCircle size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
              </div>
              <p className={styles.toastMessage}>{toast.message}</p>
              <button
                onClick={() => setToast({ ...toast, show: false })}
                className={styles.toastClose}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
