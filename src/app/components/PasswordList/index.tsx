"use client";

import { useState, useEffect } from "react";
import { FiClipboard, FiTrash2 } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import styles from "./styles.module.scss";

interface Password {
  id: number;
  originalName: string;
  generatedPassword: string;
  createdAt: string;
}

interface PasswordListProps {
  refresh: number;
  userId: string;
}

export default function PasswordList({ refresh, userId }: PasswordListProps) {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<Password | null>(
    null
  );

  useEffect(() => {
    async function fetchPasswords() {
      setLoading(true);
      try {
        const res = await fetch(`/api/passwords?userId=${userId}`);
        const data = await res.json();
        setPasswords(data);
      } catch {
        setPasswords([]);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchPasswords();
    }
  }, [refresh, userId]);

  const copyPassword = (password: string) => {
    navigator.clipboard
      .writeText(password)
      .then(() => toast.success("Senha copiada para a área de transferência!"))
      .catch(() => toast.error("Erro ao copiar senha"));
  };

  // Função chamando modal
  const openDeleteModal = (password: Password) => {
    setPasswordToDelete(password);
    setModalOpen(true);
  };

  // Confirmar exclusão vindo da modal
  const confirmDeletePassword = async () => {
    if (!passwordToDelete) return;
    setDeletingId(passwordToDelete.id);
    try {
      const res = await fetch(`/api/passwords/${passwordToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPasswords((prev) =>
          prev.filter((p) => p.id !== passwordToDelete.id)
        );
        toast.success("Senha deletada com sucesso!");
      } else {
        toast.error("Erro ao deletar senha");
      }
    } catch {
      toast.error("Erro na requisição");
    } finally {
      setDeletingId(null);
      setModalOpen(false);
      setPasswordToDelete(null);
    }
  };

  // Cancelar exclusão
  const cancelDelete = () => {
    setModalOpen(false);
    setPasswordToDelete(null);
  };

  return (
    <div className={styles.container}>
      <Toaster position="bottom-right" reverseOrder={false} />
      <h2 className={styles.title}>Senhas Geradas</h2>
      {loading && <p className={styles.loading}>Carregando senhas...</p>}
      {!loading && passwords.length === 0 && (
        <p className={styles.empty}>Nenhuma senha cadastrada.</p>
      )}
      <ul className={styles.list}>
        {passwords.map((p) => (
          <li key={p.id} className={styles.card}>
            <div className={styles.content}>
              <div className={styles.field}>
                <span className={styles.label}>Nome Original:</span>
                <span className={styles.value}>{p.originalName}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.label}>Senha Gerada:</span>
                <span className={`${styles.value} ${styles.encrypted}`}>
                  {p.generatedPassword}
                </span>
              </div>
              <div className={styles.date}>
                {new Date(p.createdAt).toLocaleString()}
              </div>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.copyButton}
                onClick={() => copyPassword(p.generatedPassword)}
                title="Copiar senha"
                aria-label="Copiar senha"
              >
                <FiClipboard size={18} />
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => openDeleteModal(p)}
                disabled={deletingId === p.id}
                title="Excluir senha"
                aria-label="Excluir senha"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal de confirmação */}
      {modalOpen && passwordToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirma exclusão?</h3>
            <p>
              Você realmente deseja deletar a senha para{" "}
              <strong>{passwordToDelete.originalName}</strong>?
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.buttonCancel} onClick={cancelDelete}>
                Cancelar
              </button>
              <button
                className={styles.buttonConfirm}
                onClick={confirmDeletePassword}
                disabled={deletingId === passwordToDelete.id}
              >
                {deletingId === passwordToDelete.id
                  ? "Excluindo..."
                  : "Sim, deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
