import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyNumericPassword } from "@/lib/crypto";

export async function POST(request: NextRequest) {
  try {
    const { generatedPassword } = await request.json();

    if (!generatedPassword) {
      return NextResponse.json(
        { error: "Senha é obrigatória" },
        { status: 400 }
      );
    }

    const allPasswords = await prisma.password.findMany();

    const found = allPasswords.find((p) =>
      verifyNumericPassword(generatedPassword, p.originalName, p.passwordLength)
    );

    if (!found) {
      return NextResponse.json(
        { error: "Senha não encontrada ou inválida" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      originalName: found.originalName,
      passwordLength: found.passwordLength,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar nome original" },
      { status: 500 }
    );
  }
}
