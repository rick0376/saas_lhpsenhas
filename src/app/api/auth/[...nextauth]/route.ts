import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next"; // Usando NextApiRequest e NextApiResponse para garantir compatibilidade

// Definindo as opções do NextAuth
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // Conexão com o Prisma Adapter
  providers: [
    CredentialsProvider({
      name: "Credentials", // Nome do provedor de autenticação
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Retorna os dados do usuário ao ser validado
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    // Callback para o JWT, adicionando os dados do usuário no token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Callback para a sessão, atualizando os dados da sessão com o token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "USER"
          | "ADMIN"
          | "SUPERADMIN"
          | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Usando o JWT para a estratégia de sessão
  },
  secret: process.env.NEXTAUTH_SECRET, // Definindo a chave secreta do NextAuth
};

// Função assíncrona para o handler da API com o tipo correto para Next.js 13+
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions); // Usando NextApiRequest e NextApiResponse diretamente
}

// Exportando os métodos GET e POST corretamente para o Next.js 13+
export const GET = handler;
export const POST = handler;
