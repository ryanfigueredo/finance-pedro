export type Cliente = {
  taxaAntecipacao: number; // percentual
  taxaServico: number; // percentual
  taxaBancaria: number; // R$
  taxaAdicional: number; // R$
};

export type DuplicataOriginal = {
  id: string;
  numero: string;
  valor: number;
  vencimento: string; // Ex: '2025-07-31'
};

export type DuplicataComCalculo = {
  id: string;
  numero: string;
  valor: number;
  vencimento: string;
  diasRestantes: number;
  taxa: number; // antecipação
  valorLiquido: number;
};

export function calcularValoresDuplicatas(
  duplicatas: DuplicataOriginal[],
  cliente: Cliente
): DuplicataComCalculo[] {
  return duplicatas.map((d) => {
    const hoje = new Date();
    const venc = new Date(d.vencimento);
    const diasRestantes = Math.max(
      1,
      Math.ceil((venc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    );

    const taxaAntecipacao = cliente.taxaAntecipacao ?? 0;
    const taxaServico = cliente.taxaServico ?? 0;
    const taxaBancaria = cliente.taxaBancaria ?? 0;
    const taxaAdicional = cliente.taxaAdicional ?? 0;

    const descontoAntecipacao =
      d.valor * (taxaAntecipacao / 30 / 100) * diasRestantes;

    const descontoServico = d.valor * (taxaServico / 100);

    const descontoFixos = taxaBancaria + taxaAdicional;

    const valorLiquido =
      d.valor - (descontoAntecipacao + descontoServico + descontoFixos);

    return {
      ...d,
      diasRestantes,
      taxa: taxaAntecipacao,
      valorLiquido: Number(valorLiquido.toFixed(2)),
    };
  });
}
