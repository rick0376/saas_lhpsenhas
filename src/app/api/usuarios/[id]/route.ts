// src/app/api/usuarios/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  // extrai o id da url, considerando estrutura /api/usuarios/{id}
  const parts = pathname.split("/");
  const idParam = parts[parts.length - 1];
  const userId = Number(idParam);

  if (isNaN(userId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
