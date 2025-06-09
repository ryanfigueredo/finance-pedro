import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  duplicataId: z.string(),
  taxa: z.number(),
  valorFinal: z.number(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { duplicataId, taxa, valorFinal } = parsed.data;

  const antecipacao = await prisma.antecipacao.create({
    data: {
      duplicataId,
      taxaAplicada: taxa,
      valorFinal,
    },
  });

  await prisma.duplicata.update({
    where: { id: duplicataId },
    data: { status: "ANTECIPADA" },
  });

  return NextResponse.json({ antecipacao }, { status: 201 });
}

export async function GET() {
  try {
    const antecipacoes = await prisma.antecipacao.findMany({
      orderBy: { dataSolicitada: "desc" },
      include: {
        duplicata: {
          select: {
            numero: true,
            valor: true,
          },
        },
      },
    });

    return NextResponse.json(antecipacoes);
  } catch (error) {
    console.error("Erro ao buscar antecipações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar antecipações" },
      { status: 500 }
    );
  }
}
