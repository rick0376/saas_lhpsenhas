"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import {
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import styles from "./styles.module.scss";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
  _count: {
    generatedPasswords: number;
  };
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER" as "USER" | "ADMIN" | "SUPERADMIN",
  });
  const [isSaving, setIsSaving] = useState(false);

  const isSuperAdmin = session?.user?.role === "SUPERADMIN";

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email,
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  // Toast auto-hide effect
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      showToast("Erro ao carregar usuários", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar usuário");
      }

      await fetchUsers();
      showToast("Usuário atualizado com sucesso!", "success");
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      showToast(error.message || "Erro ao atualizar usuário", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao excluir usuário");
      }

      await fetchUsers();
      showToast("Usuário excluído com sucesso!", "success");
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error: any) {
      showToast(error.message || "Erro ao excluir usuário", "error");
    }
  };

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      default:
        return "Usuário";
    }
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <XCircle size={20} />;
      case "warning":
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className={styles.accessDenied}>
        <AlertCircle size={64} className={styles.accessDeniedIcon} />
        <h2>Acesso Negado</h2>
        <p>Apenas Super Administradores podem acessar esta página.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Gerenciamento de Usuários</h1>
          <p>Total de {users.length} usuário(s) cadastrado(s)</p>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Permissão</th>
                <th>Senhas</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <span className={styles.userId}>#{user.id}</span>
                  </td>
                  <td>
                    <span className={styles.userName}>{user.name || "-"}</span>
                  </td>
                  <td>
                    <span className={styles.userEmail}>{user.email}</span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        styles[user.role.toLowerCase()]
                      }`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <span className={styles.passwordCount}>
                      {user._count.generatedPasswords}
                    </span>
                  </td>
                  <td>
                    <span className={styles.date}>
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEditUser(user)}
                        className={styles.btnEdit}
                        title="Editar usuário"
                        aria-label="Editar usuário"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className={styles.btnDelete}
                        disabled={user.id.toString() === session?.user?.id}
                        title="Excluir usuário"
                        aria-label="Excluir usuário"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal &&
        selectedUser &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div
              className={styles.modalBackdrop}
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
            />

            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>Editar Usuário</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                  }}
                  className={styles.modalCloseBtn}
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveUser} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nome do usuário"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Permissão</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "USER" | "ADMIN" | "SUPERADMIN",
                      })
                    }
                  >
                    <option value="USER">Usuário</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
                  </select>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                    className={styles.btnCancel}
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.btnPrimary}
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm &&
        userToDelete &&
        createPortal(
          <div className={styles.modalOverlay}>
            <div
              className={styles.modalBackdrop}
              onClick={() => {
                setShowDeleteConfirm(false);
                setUserToDelete(null);
              }}
            />

            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>Confirmar Exclusão</h3>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                  className={styles.modalCloseBtn}
                  aria-label="Fechar modal"
                >
                  ×
                </button>
              </div>

              <div className={styles.confirmMessage}>
                <div className={styles.warningIcon}>
                  <AlertCircle size={48} />
                </div>
                <p>
                  Tem certeza que deseja excluir o usuário{" "}
                  <strong>"{userToDelete.name || userToDelete.email}"</strong>?
                </p>
                <p className={styles.warningText}>
                  Esta ação não pode ser desfeita e todas as senhas geradas por
                  este usuário também serão excluídas.
                </p>
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                  className={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className={styles.btnDanger}
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Toast */}
      {toast.show &&
        createPortal(
          <div className={styles.toastContainer}>
            <div className={`${styles.toast} ${styles[toast.type]}`}>
              <span className={styles.toastIcon}>{getToastIcon()}</span>
              <p>{toast.message}</p>
              <button
                onClick={() => setToast({ ...toast, show: false })}
                className={styles.toastClose}
              >
                ×
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
