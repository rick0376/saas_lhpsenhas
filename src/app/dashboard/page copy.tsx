"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

import EncryptForm from "../components/EncryptForm";
import NumericPasswordForm from "../components/NumericPasswordForm";
import PasswordList from "../components/PasswordList";
import DecryptForm from "../components/DecryptForm";
import NumericDecryptForm from "../components/NumericDecryptForm";
import styles from "./styles.module.scss";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.id) {
        setUserId(String(session.user.id));
      }
    }

    if (status === "unauthenticated") {
      signIn(); // redirecionar para login se não autenticado
    }
  }, [status, session]);

  function forceRefresh() {
    setRefresh((prev) => prev + 1);
  }

  if (status === "loading" || !userId) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Carregando seu dashboard...</h1>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Dashboard do Usuário</h1>

      <section className={styles.section}>
        <EncryptForm onGenerated={forceRefresh} userId={userId} />
      </section>

      <section className={styles.section}>
        <NumericPasswordForm onGenerated={forceRefresh} userId={userId} />
      </section>

      <section className={styles.section}>
        <PasswordList refresh={refresh} userId={userId} />
      </section>

      <section className={styles.section}>
        <DecryptForm />
      </section>

      <section className={styles.section}>
        <NumericDecryptForm onGenerated={forceRefresh} userId={userId} />
      </section>
    </main>
  );
}
