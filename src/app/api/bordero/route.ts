import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Geração manual de borderô por seleção de duplicatas
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { duplicatas: duplicatasInput } = body;

    if (
      !duplicatasInput ||
      !Array.isArray(duplicatasInput) ||
      duplicatasInput.length === 0
    ) {
      return NextResponse.json(
        { error: "Nenhuma duplicata enviada." },
        { status: 400 }
      );
    }

    const duplicataIds = duplicatasInput.map((d: any) => d.id);

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

    const resultadoMap = new Map(
      duplicatasInput.map((d: { id: string; resultado: number }) => [
        d.id,
        d.resultado,
      ])
    );

    const duplicatasComResultado = duplicatas.map((d) => ({
      ...d,
      resultado: resultadoMap.get(d.id) ?? 0,
    }));

    const valorBruto = duplicatasComResultado.reduce(
      (acc, d) => acc + d.valor,
      0
    );
    const valorLiquido = duplicatasComResultado.reduce(
      (acc, d) => acc + d.resultado,
      0
    );
    const totalTaxas = valorBruto - valorLiquido;

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
            resultado: resultadoMap.get(d.id) ?? 0,
          },
        })
      )
    );

    return NextResponse.json({ bordero }, { status: 201 });
  } catch (error) {
    console.error("Erro ao gerar borderô manual:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar borderô manual." },
      { status: 500 }
    );
  }
}

// Consulta de todos os borderôs existentes
export async function GET() {
  try {
    const borderos = await prisma.bordero.findMany({
      orderBy: { dataGeracao: "desc" },
      include: { cliente: true },
    });

    return NextResponse.json(borderos);
  } catch (error) {
    console.error("Erro ao buscar borderôs:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar borderôs." },
      { status: 500 }
    );
  }
}
