"use client";

import { useState } from "react";
import styles from "./styles.module.scss";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage("Usuário cadastrado com sucesso!");
    } else {
      setMessage(data.error || "Erro no cadastro");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Cadastrar</button>
      {message && <p>{message}</p>}
    </form>
  );
}
