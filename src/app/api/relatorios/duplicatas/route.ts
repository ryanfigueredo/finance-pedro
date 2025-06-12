import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { StatusDuplicata, Prisma } from "@prisma/client"; // Importa Prisma aqui

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cliente = searchParams.get("cliente") || undefined;
    const sacado = searchParams.get("sacado") || undefined;
    const statusParam = searchParams.get("status") || undefined;
    const inicio = searchParams.get("inicio") || undefined;
    const fim = searchParams.get("fim") || undefined;

    const where: Prisma.DuplicataWhereInput = {
      ...(cliente && {
        cliente: {
          nome: {
            contains: cliente,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      }),
      ...(sacado && {
        sacadoNome: {
          contains: sacado,
          mode: Prisma.QueryMode.insensitive, // 👈 Aqui a correção
        },
      }),
      ...(statusParam &&
        statusParam !== "TODOS" && {
          status: statusParam as StatusDuplicata,
        }),
      ...(inicio &&
        fim && {
          emissao: {
            gte: new Date(inicio),
            lte: new Date(fim),
          },
        }),
    };

    const duplicatas = await prisma.duplicata.findMany({
      where,
      include: {
        cliente: {
          select: { nome: true },
        },
      },
      orderBy: {
        emissao: "desc",
      },
    });

    return NextResponse.json(duplicatas);
  } catch (error) {
    console.error("Erro ao buscar duplicatas:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
