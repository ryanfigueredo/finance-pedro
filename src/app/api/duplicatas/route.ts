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

  const { numero, valor, vencimento, observacoes, clienteId } = parsed.data;

  // ✅ ID mockado temporário até NextAuth estar funcionando
  const userId = "f38f31fd-0974-4475-9aa3-4aab0c6d6a70";

  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId },
  });

  if (!cliente) {
    return NextResponse.json(
      { error: "Cliente não encontrado" },
      { status: 404 }
    );
  }

  // 🧠 Cálculo de taxas
  const hoje = new Date();
  const venc = new Date(vencimento);
  const dias = Math.max(
    1,
    Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  );

  const taxaComposta = Math.pow(1 + cliente.taxaAntecipacao / 100, dias) - 1;
  const totalTaxasPercentuais = taxaComposta + (cliente.taxaServico ?? 0) / 100;
  const totalTaxasFixas =
    (cliente.taxaAdicional ?? 0) + (cliente.taxaBancaria ?? 0);

  const resultado = valor - (valor * totalTaxasPercentuais + totalTaxasFixas);

  const duplicata = await prisma.duplicata.create({
    data: {
      numero,
      valor,
      vencimento: venc,
      observacoes,
      status: "PENDENTE",
      clienteId,
      userId,
      valorComDesconto: valor - valor * totalTaxasPercentuais,
      resultado: parseFloat(resultado.toFixed(2)),
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
