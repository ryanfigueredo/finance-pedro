import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  valor: z.number(),
  valorComDesconto: z.number().optional(),
  vencimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
  observacoes: z.string().optional(),
  clienteId: z.string(),
  sacadoNome: z.string().min(1),
  sacadoCpfCnpj: z.string().regex(/^\d{11}$|^\d{14}$/, "CPF ou CNPJ inválido"),
  userId: z.string(),
});

export async function POST(req: Request) {
  try {
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
      valor,
      vencimento,
      observacoes,
      clienteId,
      sacadoNome,
      sacadoCpfCnpj,
      userId,
    } = parsed.data;

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const hoje = new Date();
    const venc = new Date(vencimento);
    const msPorDia = 1000 * 60 * 60 * 24;
    const diffMs = venc.getTime() - hoje.getTime();
    const dias = Math.max(0, Math.floor(diffMs / msPorDia));

    const taxaDiaria = cliente.taxaAntecipacao / 30 / 100;
    const descontoAntecipacao = valor * taxaDiaria * dias;
    const totalTaxasPercentuais = (cliente.taxaServico ?? 0) / 100;
    const totalTaxasFixas =
      (cliente.taxaAdicional ?? 0) + (cliente.taxaBancaria ?? 0);
    const resultado =
      valor -
      (descontoAntecipacao + valor * totalTaxasPercentuais + totalTaxasFixas);

    const totalDuplicatas = await prisma.duplicata.count();
    const numero = (totalDuplicatas + 1).toString().padStart(6, "0");
    const numeroPublico = `DUP-${numero}`;

    const duplicata = await prisma.duplicata.create({
      data: {
        numero,
        numeroPublico,
        valor,
        vencimento: venc,
        observacoes,
        status: "PENDENTE",
        clienteId,
        userId,
        sacadoNome,
        sacadoCpfCnpj,
        emissao: new Date(),
        valorComDesconto: valor - valor * totalTaxasPercentuais,
        resultado: parseFloat(resultado.toFixed(2)),
      },
    });

    return NextResponse.json(duplicata, { status: 201 });
  } catch (err) {
    console.error("🔥 ERRO INTERNO AO SALVAR DUPLICATA:", err);
    return NextResponse.json(
      { error: "Erro interno ao salvar duplicata" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const duplicatas = await prisma.duplicata.findMany({
    orderBy: { emissao: "desc" },
    select: {
      id: true,
      numero: true,
      valor: true,
      status: true,
      vencimento: true,
      emissao: true,
      resultado: true,
      sacadoNome: true,
      cliente: {
        select: { nome: true },
      },
    },
  });

  return NextResponse.json(duplicatas);
}
