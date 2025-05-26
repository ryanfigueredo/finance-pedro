"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function ConsultaCreditoPage() {
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [valor, setValor] = useState(0);
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch("/api/consulta-credito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpfCnpj, valor }),
      });

      if (!res.ok) throw new Error("Erro na consulta");

      const data = await res.json();
      setResultado(data);
      toast.success("Consulta realizada com sucesso ✅");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao consultar crédito ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-4 text-zinc-800">
        Consulta de Crédito
      </h1>

      <div className="space-y-4">
        <div>
          <Label>CPF/CNPJ do Cliente</Label>
          <Input
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            placeholder="Digite o CPF ou CNPJ"
          />
        </div>

        <div>
          <Label>Valor da Duplicata</Label>
          <Input
            type="number"
            value={valor}
            onChange={(e) => setValor(Number(e.target.value))}
            placeholder="Ex: 1000"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? "Consultando..." : "Consultar"}
        </Button>

        {resultado && (
          <div className="mt-6 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
            <h2 className="text-base font-semibold text-zinc-700 mb-2">
              Resultado da Consulta
            </h2>
            <div className="space-y-1 text-sm text-zinc-700">
              <p>
                <span className="font-medium">Nome:</span> {resultado.nome}
              </p>
              <p>
                <span className="font-medium">Score:</span>{" "}
                <Badge
                  variant="outline"
                  className={
                    resultado.score >= 800
                      ? "border-green-400 text-green-600"
                      : resultado.score >= 700
                      ? "border-yellow-400 text-yellow-500"
                      : "border-red-400 text-red-600"
                  }
                >
                  {resultado.score}
                </Badge>
              </p>
              <p>
                <span className="font-medium">Status SPC/Serasa:</span>{" "}
                {resultado.negativado ? (
                  <Badge className="bg-red-500">Negativado ❌</Badge>
                ) : (
                  <Badge className="bg-green-500">Regular ✅</Badge>
                )}
              </p>
              <p>
                <span className="font-medium">Apto para Emissão:</span>{" "}
                {resultado.aptoParaEmissao ? (
                  <span className="text-green-600 font-semibold">Sim ✅</span>
                ) : (
                  <span className="text-red-500 font-semibold">Não ❌</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
