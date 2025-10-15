"use client";

import { useState } from "react";
import styles from "./styles.module.scss";

export default function SuperadminCadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [tipoMsg, setTipoMsg] = useState<"erro" | "sucesso" | "">("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setTipoMsg("");

    const res = await fetch("/api/superadmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg(data.message ?? "SuperAdmin cadastrado com sucesso!");
      setTipoMsg("sucesso");
      setNome("");
      setEmail("");
      setSenha("");
    } else {
      setMsg(data.error ?? "Erro ao cadastrar SuperAdmin.");
      setTipoMsg("erro");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro do SuperAdmin</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className={styles.input}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className={styles.button}>
          Cadastrar
        </button>
      </form>
      {msg && (
        <p
          className={`${styles.message} ${
            tipoMsg === "sucesso" ? styles.success : styles.error
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
