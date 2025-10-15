"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./styles.module.scss";

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const userIdParam = searchParams.get("userId");
  const userId = userIdParam ? Number(userIdParam) : null;

  const [userEmail, setUserEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserEmail() {
      if (!userId) {
        setMsg("ID de usuário inválido.");
        return;
      }
      try {
        const res = await fetch(`/api/usuarios/${userId}`);
        if (!res.ok) {
          throw new Error("Usuário não encontrado");
        }
        const data = await res.json();
        setUserEmail(data.email || "");
      } catch {
        setMsg("Usuário não encontrado");
      }
    }
    fetchUserEmail();
  }, [userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false, // evita redirecionamento automático para controlar fluxo manualmente
        email: userEmail,
        password: passwordInput,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setMsg("Email ou senha incorretos.");
      } else if (result?.url) {
        router.push(result.url); // redireciona manualmente para dashboard
      } else {
        setMsg("Erro inesperado no login.");
      }
    } catch {
      setMsg("Erro na conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>
      {userEmail && <p className={styles.subtitle}>Usuário: {userEmail}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="Senha"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {msg && <p className={styles.message}>{msg}</p>}
    </div>
  );
}
