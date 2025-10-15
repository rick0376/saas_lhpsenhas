import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { generatePassword } from "@/lib/crypto";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 401 }
    );
  }

  try {
    const passwords = await prisma.generatedPassword.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(passwords);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar senhas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 401 }
    );
  }

  const { originalName, passwordLength } = await request.json();

  if (!originalName) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const length = passwordLength || 12;
  if (length < 8 || length > 16) {
    return NextResponse.json(
      { error: "Tamanho da senha deve ser entre 8 e 16 caracteres" },
      { status: 400 }
    );
  }

  const generatedPassword = generatePassword(originalName, length);

  try {
    const password = await prisma.generatedPassword.create({
      data: {
        originalName,
        generatedPassword,
        passwordLength: length,
        userId: user.id,
      },
    });
    return NextResponse.json(password);
  } catch {
    return NextResponse.json({ error: "Erro ao criar senha" }, { status: 500 });
  }
}
