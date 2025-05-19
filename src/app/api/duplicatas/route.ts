import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  numero: z.string().min(1),
  valor: z.number(),
  valorComDesconto: z.number().optional(),
  vencimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
  observacoes: z.string().optional(),
  clienteId: z.string(),
});

export async function POST(req: Request) {
  const body = await req.json();

  console.log("📥 Body recebido:", body);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    console.error("❌ Erros de validação Zod:", parsed.error.errors);
    return NextResponse.json(
      { error: "Dados inválidos", issues: parsed.error.errors },
      { status: 400 }
    );
  }

  const {
    numero,
    valor,
    valorComDesconto,
    vencimento,
    observacoes,
    clienteId,
  } = parsed.data;

  const userId = "517a08fe-9c36-43b2-b8a9-3009142c1f1d";

  const duplicata = await prisma.duplicata.create({
    data: {
      numero,
      valor,
      valorComDesconto,
      vencimento: new Date(vencimento),
      observacoes,
      status: "PENDENTE",
      clienteId,
      userId,
    },
  });

  return NextResponse.json(duplicata, { status: 201 });
}

export async function GET() {
  const duplicatas = await prisma.duplicata.findMany({
    orderBy: { emissao: "desc" },
    include: {
      cliente: { select: { nome: true } },
    },
  });

  return NextResponse.json(duplicatas);
}
