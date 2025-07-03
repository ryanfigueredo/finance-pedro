import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export async function GET(request: Request, context: any) {
  const id = context?.params?.id;

  try {
    const bordero = await prisma.bordero.findUnique({
      where: { id },
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

    const doc = new PDFDocument();
    const stream = new PassThrough();

    doc.pipe(stream);

    doc.fontSize(20).text("Borderô de Desconto", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${bordero.cliente.nome}`);
    doc.text(
      `Data de Geração: ${new Date(bordero.dataGeracao).toLocaleDateString(
        "pt-BR"
      )}`
    );
    doc.moveDown();

    doc.fontSize(14).text("Duplicatas:");
    doc.moveDown(0.5);

    bordero.duplicatas.forEach((d) => {
      const hoje = new Date(bordero.dataGeracao);
      const venc = new Date(d.vencimento);
      const diffMs = venc.getTime() - hoje.getTime();
      const dias = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      const taxa = bordero.cliente.taxaAntecipacao ?? 0;
      const descontoPorDia = taxa / 30 / 100;
      const desconto = d.valor * descontoPorDia * dias;
      const resultado = d.resultado ?? d.valor - desconto;

      doc
        .fontSize(12)
        .text(
          `• Nº ${d.numero} | Valor: R$ ${d.valor.toFixed(
            2
          )} | Vencimento: ${venc.toLocaleDateString("pt-BR")}`
        )
        .text(
          `  Dias: ${dias} | Taxa: ${taxa}% | Desconto: R$ ${desconto.toFixed(
            2
          )} | Líquido: R$ ${resultado.toFixed(2)}`
        )
        .moveDown(0.3);
    });

    doc.moveDown();
    doc.fontSize(12).text(`Valor Bruto: R$ ${bordero.valorBruto.toFixed(2)}`);
    doc.text(`Total de Taxas: R$ ${bordero.totalTaxas.toFixed(2)}`);
    doc.text(`Valor Líquido: R$ ${bordero.valorLiquido.toFixed(2)}`);
    doc.moveDown(2);
    doc.text("Assinatura:");
    doc.moveDown(2);
    doc.text("_____________________________");

    doc.end();

    const readableStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=bordero-${id}.pdf`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro ao gerar PDF." }, { status: 500 });
  }
}
