"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface Password {
  id: number;
  originalName: string;
  generatedPassword: string;
  passwordLength: number;
  createdAt: string;
}

export default function PasswordList({ refresh }: { refresh: number }) {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPasswords();
  }, [refresh]);

  const fetchPasswords = async () => {
    try {
      const response = await fetch("/api/passwords");
      const data = await response.json();
      setPasswords(data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente deletar esta senha?")) return;

    try {
      const response = await fetch(`/api/passwords?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPasswords(passwords.filter((p) => p.id !== id));
      } else {
        alert("Erro ao deletar");
      }
    } catch (error) {
      alert("Erro na requisição");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado para área de transferência!");
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Senhas Geradas ({passwords.length})</h2>

      {passwords.length === 0 ? (
        <p className={styles.empty}>Nenhuma senha gerada ainda.</p>
      ) : (
        <div className={styles.list}>
          {passwords.map((password) => (
            <div key={password.id} className={styles.card}>
              <div className={styles.content}>
                <div className={styles.field}>
                  <span className={styles.label}>Nome Original:</span>
                  <span className={styles.value}>{password.originalName}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>
                    Senha Gerada ({password.passwordLength} caracteres):
                  </span>
                  <span className={styles.encrypted}>
                    {password.generatedPassword}
                  </span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Data:</span>
                  <span className={styles.date}>
                    {new Date(password.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  onClick={() => copyToClipboard(password.generatedPassword)}
                  className={styles.copyButton}
                >
                  Copiar Senha
                </button>
                <button
                  onClick={() => handleDelete(password.id)}
                  className={styles.deleteButton}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
