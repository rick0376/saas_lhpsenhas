"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import styles from "./styles.module.scss";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLUListElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Fecha menu ao clicar fora do menu ou botão
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuOpen &&
        menuRef.current &&
        burgerRef.current &&
        !menuRef.current.contains(target) &&
        !burgerRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const userRole = (session?.user as any)?.role ?? null;
  const isSuperAdmin = userRole === "SUPERADMIN";
  const isLoggedIn = !!session;

  // Função para renderizar links desabilitados (não clicáveis)
  function renderLink(
    href: string,
    label: string,
    disabled: boolean
  ): JSX.Element {
    if (disabled) {
      return (
        <span
          className={`${styles.item} ${styles.disabled}`}
          aria-disabled="true"
          tabIndex={-1}
        >
          {label}
        </span>
      );
    }
    return (
      <Link href={href} className={styles.item}>
        {label}
      </Link>
    );
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <button
          ref={burgerRef}
          className={styles.burger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          type="button"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {session?.user?.name && (
          <span className={styles.userName}>Olá, {session.user.name}</span>
        )}

        <ul
          ref={menuRef}
          className={`${styles.menu} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen(false)}
          role="menu"
        >
          <li>{renderLink("/", "Início", false)}</li>

          <li className={styles.menuGroupLabel}>Cadastros</li>

          <li>{renderLink("/superadmin", "SuperAdmin", !isSuperAdmin)}</li>
          <li>{renderLink("/usuarios", "Usuários", !isSuperAdmin)}</li>

          <li>
            <button
              className={`${styles.logoutItem} ${styles.item}`}
              onClick={() => signOut({ callbackUrl: "/" })}
              type="button"
              disabled={!isLoggedIn}
              aria-disabled={!isLoggedIn}
            >
              <LogOut size={16} style={{ marginRight: "0.5rem" }} />
              Deslogar
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
