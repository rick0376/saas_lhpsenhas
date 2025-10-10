"use client";

import { useState } from "react";
import EncryptForm from "./components/EncryptForm";
import NumericPasswordForm from "./components/NumericPasswordForm";
import DecryptForm from "./components/DecryptForm";
import NumericDecryptForm from "./components/NumericDecryptForm";
import PasswordList from "./components/PasswordList";
import styles from "./page.module.scss";

export default function Home() {
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState<"normal" | "numeric">("normal");

  const handleRefresh = () => setRefresh((prev) => prev + 1);

  return (
    <main className="container">
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>
          Gerenciador de Senhas Criptografadas
        </h1>
        <p className={styles.subtitle}>
          Crie senhas seguras a partir de nomes ou frases
        </p>
      </header>

      {/* Abas */}
      <nav className={styles.tabs}>
        <button
          className={tab === "normal" ? styles.active : ""}
          onClick={() => setTab("normal")}
        >
          Senha Normal
        </button>
        <button
          className={tab === "numeric" ? styles.active : ""}
          onClick={() => setTab("numeric")}
        >
          Senha Numérica
        </button>
      </nav>

      <div className="grid">
        <div className="column">
          {tab === "normal" && (
            <>
              <EncryptForm onEncrypted={handleRefresh} />
              <DecryptForm />
            </>
          )}
          {tab === "numeric" && (
            <>
              <NumericPasswordForm onGenerated={handleRefresh} />
              <NumericDecryptForm />
            </>
          )}
        </div>
        <div className="column">
          <PasswordList refresh={refresh} />
        </div>
      </div>
    </main>
  );
}
