"use client";

import { useState } from "react";
import styles from "./styles.module.scss";

interface EncryptFormProps {
  onGenerated: () => void;
  userId: string;
}

export default function EncryptForm({ onGenerated, userId }: EncryptFormProps) {
  const [originalName, setOriginalName] = useState("");
  const [passwordLength, setPasswordLength] = useState(12);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/passwords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalName, passwordLength, userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setGeneratedPassword(data.generatedPassword);
        setOriginalName("");
        onGenerated();
      } else {
        alert(data.error || "Erro ao gerar senha");
      }
    } catch {
      alert("Erro na requisição");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Gerar Senha</h2>
      <form onSubmit={handleGenerate} className={styles.form}>
        <input
          type="text"
          value={originalName}
          onChange={(e) => setOriginalName(e.target.value)}
          placeholder="Digite um nome ou frase"
          className={styles.input}
          required
        />
        <div className={styles.lengthControl}>
          <label htmlFor="length">
            Tamanho da senha: {passwordLength} caracteres
          </label>
          <input
            id="length"
            type="range"
            min={8}
            max={16}
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
            className={styles.slider}
          />
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Gerando..." : "Gerar Senha"}
        </button>
      </form>
      {generatedPassword && (
        <div className={styles.result}>
          <h3>Senha Gerada:</h3>
          <p className={styles.encrypted}>{generatedPassword}</p>
        </div>
      )}
    </div>
  );
}
