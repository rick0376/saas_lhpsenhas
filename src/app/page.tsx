// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";

type UserType = {
  id: number;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
};

export default function Home() {
  const [usuarios, setUsuarios] = useState<UserType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await fetch("/api/usuarios/all");
        if (!response.ok) {
          throw new Error("Erro ao buscar usuários");
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido");
        }
      }
    }
    fetchUsuarios();
  }, []);

  function handleLogin(id: number) {
    window.location.href = `/login?userId=${id}`;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>LHPSYSTEMS - Gera Senhas</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.cards}>
        {usuarios.map((user) => (
          <div
            key={user.id}
            className={styles.card}
            onClick={() => handleLogin(user.id)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleLogin(user.id);
              }
            }}
          >
            <h2 className={styles.cardTitle}>{user.name ?? "(Sem nome)"}</h2>
            <p className={styles.cardEmail}>{user.email}</p>
            <span className={styles.cardRole}>{user.role}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
