import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const duplicatas = await prisma.duplicata.findMany({
      where: {
        status: "ANTECIPADA",
        borderoId: null,
      },
      include: {
        cliente: true,
      },
    });

    if (duplicatas.length === 0) {
      return NextResponse.json(
        {
          message:
            "Nenhuma duplicata antecipada disponível para gerar borderô.",
        },
        { status: 200 }
      );
    }

    const duplicatasPorCliente = new Map<string, typeof duplicatas>();

    for (const dup of duplicatas) {
      const grupo = duplicatasPorCliente.get(dup.clienteId) || [];
      grupo.push(dup);
      duplicatasPorCliente.set(dup.clienteId, grupo);
    }

    const borderosCriados = [];

    for (const [
      clienteId,
      duplicatasCliente,
    ] of duplicatasPorCliente.entries()) {
      const valorBruto = duplicatasCliente.reduce((acc, d) => acc + d.valor, 0);
      const valorLiquido = duplicatasCliente.reduce(
        (acc, d) => acc + (d.resultado || 0),
        0
      );
      const totalTaxas = valorBruto - valorLiquido;

      const bordero = await prisma.bordero.create({
        data: {
          clienteId,
          valorBruto,
          valorLiquido,
          totalTaxas,
          duplicatas: {
            connect: duplicatasCliente.map((d) => ({ id: d.id })),
          },
        },
      });

      borderosCriados.push(bordero);
    }

    return NextResponse.json(borderosCriados);
  } catch (error) {
    console.error("Erro ao gerar borderôs:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar borderôs." },
      { status: 500 }
    );
  }
}
