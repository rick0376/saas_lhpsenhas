"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";

export default function Usuarios() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuarios, setUsuarios] = useState<
    Array<{ id: string; name: string | null }>
  >([]);
  const [msg, setMsg] = useState("");
  const [tipoMsg, setTipoMsg] = useState<"erro" | "sucesso" | "">("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setTipoMsg("");

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg(data.message ?? "Usuário cadastrado com sucesso!");
      setTipoMsg("sucesso");
      setNome("");
      setEmail("");
      setSenha("");
      fetchUsuarios();
    } else {
      setMsg(data.error ?? "Erro ao cadastrar usuário.");
      setTipoMsg("erro");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Usuários</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={styles.input}
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

      <h2 className={styles.subtitle}>Usuários cadastrados</h2>
      <ul className={styles.list}>
        {usuarios.map((u) => (
          <li key={u.id} className={styles.listItem}>
            {u.name ?? "(Sem nome)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
