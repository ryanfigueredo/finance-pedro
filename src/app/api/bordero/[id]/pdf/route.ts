import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bordero = await prisma.bordero.findUnique({
      where: { id: params.id },
      include: {
        cliente: true,
        duplicatas: true,
      },
    });

    if (!bordero) {
      return NextResponse.json(
        { error: "Borderô não encontrado." },
        { status: 404 }
      );
    }

    // Criar PDF
    const doc = new PDFDocument();
    const stream = new Readable({
      read() {},
    });
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk: Uint8Array<ArrayBufferLike>) => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      return new Response(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename=bordero-${params.id}.pdf`,
        },
      });
    });

    // Cabeçalho
    doc.fontSize(20).text("Borderô de Desconto", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${bordero.cliente.nome}`);
    doc.text(
      `Data de Geração: ${new Date(bordero.dataGeracao).toLocaleDateString(
        "pt-BR"
      )}`
    );
    doc.moveDown();

    // Tabela de duplicatas
    doc.fontSize(14).text("Duplicatas:");
    doc.moveDown(0.5);
    doc.fontSize(12);

    bordero.duplicatas.forEach((d) => {
      doc.text(
        `• Nº ${d.numero}  | Valor: R$ ${d.valor.toFixed(
          2
        )}  | Vencimento: ${new Date(d.vencimento).toLocaleDateString("pt-BR")}`
      );
    });

    doc.moveDown();
    doc.fontSize(12).text(`Valor Bruto: R$ ${bordero.valorBruto.toFixed(2)}`);
    doc.text(`Total de Taxas: R$ ${bordero.totalTaxas.toFixed(2)}`);
    doc.text(`Valor Líquido: R$ ${bordero.valorLiquido.toFixed(2)}`);
    doc.moveDown();

    doc.text("Assinatura:");
    doc.moveDown(2);
    doc.text("_____________________________", { align: "left" });

    doc.end();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro ao gerar PDF." }, { status: 500 });
  }
}
