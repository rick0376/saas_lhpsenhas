import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateNumericPassword } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const { originalName, passwordLength } = await request.json();

    if (!originalName) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const length = passwordLength || 12;

    if (length < 4 || length > 16) {
      return NextResponse.json(
        { error: "Tamanho da senha deve ser entre 4 e 16 caracteres" },
        { status: 400 }
      );
    }

    const generatedPassword = generateNumericPassword(originalName, length);

    const password = await prisma.password.create({
      data: {
        originalName,
        generatedPassword,
        passwordLength: length,
      },
    });

    return NextResponse.json(password);
  } catch (error) {
    console.error("Erro ao criar senha numérica:", error);
    return NextResponse.json(
      { error: "Erro ao criar senha numérica" },
      { status: 500 }
    );
  }
}
