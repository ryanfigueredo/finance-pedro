import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "ID do cliente não informado" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parse = clienteSchema.safeParse(body);

  if (!parse.success) {
    return NextResponse.json(
      { error: "Dados inválidos", issues: parse.error.errors },
      { status: 400 }
    );
  }

  const data = parse.data;

  try {
    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nome: data.nome,
        cpfCnpj: data.cpfCnpj,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco,
        taxaAntecipacao: data.taxaAntecipacao,
        taxaBancaria: data.taxaBancaria,
        taxaServico: data.taxaServico,
        taxaAdicional: data.taxaAdicional ?? 0,
        taxaNegativacao: data.negativado ? 3.5 : 0,
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    return NextResponse.json(
      { error: "Cliente não encontrado ou erro interno" },
      { status: 404 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "ID do cliente não informado" },
      { status: 400 }
    );
  }

  try {
    await prisma.cliente.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Cliente não encontrado ou erro interno" },
      { status: 404 }
    );
  }
}
