import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente atual:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar cliente atual." },
      { status: 500 }
    );
  }
}
