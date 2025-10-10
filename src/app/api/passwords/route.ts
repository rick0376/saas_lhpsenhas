import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePassword } from "@/lib/crypto";

export async function GET() {
  try {
    const passwords = await prisma.password.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(passwords);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar senhas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { originalName, passwordLength } = await request.json();

    if (!originalName) {
      console.log("❌ originalName está vazio!"); // 👈 ADICIONE ESTA LINHA
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const length = passwordLength || 12;

    if (length < 8 || length > 16) {
      console.log("❌ Tamanho inválido:", length); // 👈 ADICIONE ESTA LINHA
      return NextResponse.json(
        { error: "Tamanho da senha deve ser entre 8 e 16 caracteres" },
        { status: 400 }
      );
    }

    const generatedPassword = generatePassword(originalName, length);

    const password = await prisma.password.create({
      data: {
        originalName,
        generatedPassword,
        passwordLength: length,
      },
    });

    return NextResponse.json(password);
  } catch (error) {
    console.error("Erro ao criar senha:", error);
    return NextResponse.json({ error: "Erro ao criar senha" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.password.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar senha" },
      { status: 500 }
    );
  }
}
