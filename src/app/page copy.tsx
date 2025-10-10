"use client";

import { useState } from "react";
import EncryptForm from "./components/EncryptForm";
import DecryptForm from "./components/DecryptForm";
import PasswordList from "./components/PasswordList";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  const handleEncrypted = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="mainTitle">Gerenciador de Senhas Criptografadas</h1>
        <p className="subtitle">
          Crie senhas seguras a partir de nomes ou frases
        </p>
      </header>

      <div className="grid">
        <div className="column">
          <EncryptForm onEncrypted={handleEncrypted} />
          <DecryptForm />
        </div>
        <div className="column">
          <PasswordList refresh={refresh} />
        </div>
      </div>
    </main>
  );
}
