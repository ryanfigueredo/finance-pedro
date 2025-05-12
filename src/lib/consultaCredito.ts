// src/lib/consultaCredito.ts
export async function consultaCreditoMock(cpfCnpj: string, valor: number) {
  const score = Math.floor(Math.random() * 400) + 600; // 600 a 1000
  const negativado = Math.random() > 0.8; // 20% chance

  return {
    nome: `Cliente ${cpfCnpj}`,
    score,
    negativado,
    aptoParaEmissao: !negativado && score >= 700,
  };
}
