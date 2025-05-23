import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const clienteSchema = z.object({
  nome: z.string().min(2),
  cpfCnpj: z.string().min(11),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  taxaAntecipacao: z.number().min(0).max(100),
  taxaBancaria: z.number().min(0),
  taxaServico: z.number().min(0).max(100),
  taxaAdicional: z.number().min(0).optional().default(0),
  negativado: z.boolean(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parse = clienteSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parse.error.errors },
      { status: 400 }
    );
  }

  const data = parse.data;

  const cliente = await prisma.cliente.create({
    data: {
      nome: data.nome,
      cpfCnpj: data.cpfCnpj,
      email: data.email,
      telefone: data.telefone,
      endereco: data.endereco,
      taxaAntecipacao: data.taxaAntecipacao,
      taxaBancaria: data.taxaBancaria,
      taxaServico: data.taxaServico,
      taxaAdicional: data.taxaAdicional ?? 0, // NOVO CAMPO
      taxaNegativacao: data.negativado ? 3.5 : 0,
    },
  });

  return NextResponse.json(cliente, { status: 201 });
}

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { nome: "asc" },
  });

  return NextResponse.json(clientes);
}
