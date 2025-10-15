"use client";

import { useState } from "react";
import styles from "./styles.module.scss";

interface NumericDecryptFormProps {
  onGenerated: () => void;
  userId: string;
}

export default function NumericDecryptForm({
  onGenerated,
  userId,
}: NumericDecryptFormProps) {
  const [encryptedPassword, setEncryptedPassword] = useState("");
  const [decryptedPassword, setDecryptedPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        alert(data.error || "Erro ao descriptografar");
      }
    } catch {
      alert("Erro na requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
