import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(userId);

    // Total de senhas
    const totalPasswords = await prisma.generatedPassword.count({
      where: { userId: userIdInt },
    });

    // Senhas dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPasswords = await prisma.generatedPassword.count({
      where: {
        userId: userIdInt,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Buscar todas as senhas para contar numéricas
    const allPasswords = await prisma.generatedPassword.findMany({
      where: { userId: userIdInt },
      select: {
        generatedPassword: true,
      },
    });

    // Contar senhas que são apenas numéricas
    const numericPasswords = allPasswords.filter((pwd) =>
      /^\d+$/.test(pwd.generatedPassword)
    ).length;

    const encryptedPasswords = totalPasswords; // Todas são criptografadas

    return NextResponse.json({
      totalPasswords,
      recentPasswords,
      numericPasswords,
      encryptedPasswords,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
