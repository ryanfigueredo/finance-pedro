// src/app/api/consulta-credito/route.ts
import { NextResponse } from "next/server";
import { consultaCreditoMock } from "@/lib/consultaCredito";

export async function POST(req: Request) {
  const body = await req.json();
  const { cpfCnpj, valor } = body;

  if (!cpfCnpj || !valor) {
    return NextResponse.json(
      { error: "cpfCnpj e valor são obrigatórios" },
      { status: 400 }
    );
  }

  const resultado = await consultaCreditoMock(cpfCnpj, valor);
  return NextResponse.json(resultado);
}
