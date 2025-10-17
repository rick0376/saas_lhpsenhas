"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import {
  Key,
  Hash,
  Lock,
  Unlock,
  TrendingUp,
  Activity,
  Calendar,
  Shield,
} from "lucide-react";

import StatsCard from "../components/Dashboard/StatsCard";
import EncryptForm from "../components/EncryptForm";
import NumericPasswordForm from "../components/NumericPasswordForm";
import PasswordList from "../components/PasswordList";
import DecryptForm from "../components/DecryptForm";
import NumericDecryptForm from "../components/NumericDecryptForm";
import styles from "./styles.module.scss";

interface DashboardStats {
  totalPasswords: number;
  recentPasswords: number;
  numericPasswords: number;
  encryptedPasswords: number;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [activeTab, setActiveTab] = useState<"generate" | "decrypt">(
    "generate"
  );
  const [stats, setStats] = useState<DashboardStats>({
    totalPasswords: 0,
    recentPasswords: 0,
    numericPasswords: 0,
    encryptedPasswords: 0,
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.id) {
        setUserId(String(session.user.id));
        fetchStats(String(session.user.id));
      }
    }

    if (status === "unauthenticated") {
      signIn();
    }
  }, [status, session]);

  const fetchStats = async (uid: string) => {
    try {
      const response = await fetch(`/api/passwords/stats?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  function forceRefresh() {
    setRefresh((prev) => prev + 1);
    if (userId) {
      fetchStats(userId);
    }
  }

  if (status === "loading" || !userId) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingWrapper}>
          <div className={styles.spinner} />
          <h2>Carregando seu dashboard...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Bem-vindo de volta, {session?.user?.name || "Usuário"}
          </p>
        </div>
        <div className={styles.headerBadge}>
          <Shield size={20} />
          <span>Seguro</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <StatsCard
          title="Total de Senhas"
          value={stats.totalPasswords}
          icon={Key}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Senhas Recentes"
          value={stats.recentPasswords}
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Senhas Numéricas"
          value={stats.numericPasswords}
          icon={Hash}
          color="purple"
        />
        <StatsCard
          title="Senhas Criptografadas"
          value={stats.encryptedPasswords}
          icon={Lock}
          color="orange"
        />
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "generate" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("generate")}
          >
            <Lock size={18} />
            Gerar Senhas
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "decrypt" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("decrypt")}
          >
            <Unlock size={18} />
            Descriptografar
          </button>
        </div>
      </div>

      {/* Content Sections */}
      {activeTab === "generate" && (
        <>
          <div className={styles.formsGrid}>
            <section className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Key size={20} />
                <h2>Gerar Senha Alfanumérica</h2>
              </div>
              <EncryptForm onGenerated={forceRefresh} userId={userId} />
            </section>

            <section className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <Hash size={20} />
                <h2>Gerar Senha Numérica</h2>
              </div>
              <NumericPasswordForm onGenerated={forceRefresh} userId={userId} />
            </section>
          </div>

          <section className={styles.listSection}>
            <div className={styles.sectionHeader}>
              <Calendar size={20} />
              <h2>Histórico de Senhas</h2>
            </div>
            <PasswordList refresh={refresh} userId={userId} />
          </section>
        </>
      )}

      {activeTab === "decrypt" && (
        <div className={styles.formsGrid}>
          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <Unlock size={20} />
              <h2>Descriptografar Senha Alfanumérica</h2>
            </div>
            <DecryptForm />
          </section>

          <section className={styles.formSection}>
            <div className={styles.sectionHeader}>
              <Unlock size={20} />
              <h2>Descriptografar Senha Numérica</h2>
            </div>
            <NumericDecryptForm onGenerated={forceRefresh} userId={userId} />
          </section>
        </div>
      )}
    </main>
  );
}
