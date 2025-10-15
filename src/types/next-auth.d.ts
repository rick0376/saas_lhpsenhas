import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // aqui você diz ao TypeScript que user terá um campo id
      role?: "USER" | "ADMIN" | "SUPERADMIN"; // e também o role
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // id como string para acesso fácil
    role: "USER" | "ADMIN" | "SUPERADMIN";
  }
}
