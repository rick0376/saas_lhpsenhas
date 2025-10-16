import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha } = await request.json();

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = await prisma.user.create({
      data: {
        name: nome,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar usuário" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const usuarios = await prisma.user.findMany({
      select: { id: true, name: true },
      where: { role: "USER" },
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar usuários" },
      { status: 500 }
    );
  }
}
