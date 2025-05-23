import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const duplicata = await prisma.duplicata.findUnique({
      where: { id },
      include: {
        cliente: {
          select: {
            taxaAntecipacao: true,
            taxaServico: true,
            taxaBancaria: true,
            taxaAdicional: true,
          },
        },
      },
    });

    if (!duplicata) {
      return NextResponse.json(
        { error: "Duplicata não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(duplicata);
  } catch (error) {
    console.error("Erro ao buscar duplicata por ID:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar duplicata." },
      { status: 500 }
    );
  }
}
