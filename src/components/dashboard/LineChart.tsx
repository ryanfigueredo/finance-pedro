"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip
);

export function LineChart() {
  const data = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
    datasets: [
      {
        label: "Duplicatas",
        data: [1000, 9500, 1200, 12400, 8800, 10400, 6000, 8700],
        borderColor: "#6366F1",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#6366F1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            `Valor: R$${ctx.parsed.y.toLocaleString("pt-BR")}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (tickValue: string | number) =>
            `R$${Number(tickValue).toLocaleString("pt-BR")}`,
        },
        grid: { drawBorder: false, color: "#F3F4F6" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-cards rounded-2xl shadow-md p-6 mt-6">
      <p className="text-text-light text-sm mb-4 font-semibold">
        Gráfico de Duplicatas por Mês
      </p>
      <Line data={data} options={options} />
    </div>
  );
}
