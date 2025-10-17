"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { XCircle, AlertCircle, X } from "lucide-react";
import styles from "./styles.module.scss";

interface NumericDecryptFormProps {
  onGenerated: () => void;
  userId: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "error" | "warning";
}

export default function NumericDecryptForm({
  onGenerated,
  userId,
}: NumericDecryptFormProps) {
  const [encryptedPassword, setEncryptedPassword] = useState("");
  const [decryptedPassword, setDecryptedPassword] = useState("");
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

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/numeric/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedPassword: encryptedPassword, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setDecryptedPassword(data.originalName || data.decryptedPassword);
        onGenerated();
      } else {
        showToast(data.error || "Erro ao descriptografar", "error");
      }
    } catch {
      showToast("Erro ao processar a requisição", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Descriptografar Senha Numérica</h2>
        <form onSubmit={handleDecrypt} className={styles.form}>
          <input
            type="text"
            value={encryptedPassword}
            onChange={(e) => setEncryptedPassword(e.target.value)}
            placeholder="Insira a senha numérica criptografada"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Descriptografando..." : "Descriptografar"}
          </button>
        </form>

        {decryptedPassword && (
          <div className={styles.result}>
            <h3>Senha Descriptografada:</h3>
            <p className={styles.decrypted}>{decryptedPassword}</p>
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
