import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { nome, email, senha } = await request.json();

  if (!nome || !email || !senha) {
    return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(senha, 10);

  const superadmin = await prisma.user.create({
    data: {
      name: nome,
      email,
      password: hashedPassword,
      role: "SUPERADMIN",
    },
  });

  return NextResponse.json({
    message: "SuperAdmin cadastrado com sucesso",
    superadmin,
  });
}
