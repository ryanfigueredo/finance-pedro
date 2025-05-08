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
