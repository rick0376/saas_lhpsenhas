"use client";

import { useState } from "react";
import styles from "./styles.module.scss";

export default function NumericDecryptForm() {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReverse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOriginalName("");

    try {
      const response = await fetch("/api/crypto/numeric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setOriginalName(data.originalName);
      } else {
        alert(data.error || "Senha numérica não encontrada");
      }
    } catch (error) {
      alert("Erro na requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Descobrir Nome pelo Número</h2>
      <form onSubmit={handleReverse} className={styles.form}>
        <input
          type="text"
          value={generatedPassword}
          onChange={(e) => setGeneratedPassword(e.target.value)}
          placeholder="Cole a senha numérica gerada"
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
  );
}
