import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const borderos = await prisma.bordero.findMany({
    orderBy: { dataGeracao: "desc" },
    include: { cliente: true },
  });

  return NextResponse.json(borderos);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { duplicataIds } = body;

    if (
      !duplicataIds ||
      !Array.isArray(duplicataIds) ||
      duplicataIds.length === 0
    ) {
      return NextResponse.json(
        { error: "Nenhuma duplicata selecionada." },
        { status: 400 }
      );
    }

    const duplicatas = await prisma.duplicata.findMany({
      where: {
        id: { in: duplicataIds },
        status: "PENDENTE",
      },
      include: {
        cliente: true,
      },
    });

    if (duplicatas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma duplicata pendente válida encontrada." },
        { status: 400 }
      );
    }

    const clienteId = duplicatas[0].clienteId;

    const valorBruto = duplicatas.reduce((acc, d) => acc + d.valor, 0);
    const totalTaxas = duplicatas.reduce((acc, d) => {
      const c = d.cliente;
      const taxas =
        (c.taxaAntecipacao ?? 0) +
        (c.taxaBancaria ?? 0) +
        (c.taxaServico ?? 0) +
        (c.taxaNegativacao ?? 0);
      return acc + d.valor * (taxas / 100);
    }, 0);

    const valorLiquido = valorBruto - totalTaxas;

    const bordero = await prisma.bordero.create({
      data: {
        clienteId,
        valorBruto,
        totalTaxas,
        valorLiquido,
        duplicatas: {
          connect: duplicatas.map((d) => ({ id: d.id })),
        },
      },
    });

    await Promise.all(
      duplicatas.map((d) =>
        prisma.duplicata.update({
          where: { id: d.id },
          data: {
            status: "ANTECIPADA",
            borderoId: bordero.id,
          },
        })
      )
    );

    return NextResponse.json({ bordero }, { status: 201 });
  } catch (error) {
    console.error("Erro ao gerar borderô:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar borderô." },
      { status: 500 }
    );
  }
}
