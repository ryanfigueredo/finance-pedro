import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const id = context.params.id;

  try {
    const bordero = await prisma.bordero.findUnique({
      where: { id },
      include: {
        cliente: true,
        duplicatas: {
          orderBy: { emissao: "asc" },
        },
      },
    });

    if (!bordero) {
      return NextResponse.json(
        { error: "Borderô não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(bordero);
  } catch (error) {
    console.error("Erro ao buscar detalhes do borderô:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar borderô." },
      { status: 500 }
    );
  }
}
