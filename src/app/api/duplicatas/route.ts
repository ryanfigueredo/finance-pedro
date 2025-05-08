import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

// --- POST /api/duplicatas ---
const schema = z.object({
  numero: z.string().min(1),
  valor: z.number(),
  valorComDesconto: z.number().optional(),
  vencimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
  observacoes: z.string().optional(),
  clienteId: z.string(),
  userId: z.string(), // vindo da sessão (temporariamente manual)
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
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
    userId,
  } = parsed.data;

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

// --- GET /api/duplicatas ---
export async function GET() {
  const duplicatas = await prisma.duplicata.findMany({
    orderBy: { emissao: "desc" },
    include: {
      cliente: { select: { nome: true } },
    },
  });

  return NextResponse.json(duplicatas);
}
