"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect } from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  data: { status: string; quantidade: number }[];
};

export function ChartDuplicatasPorStatus({ data }: Props) {
  useEffect(() => {
    console.log("🔍 Dados recebidos pelo gráfico:", data);
  }, [data]);

  const chartData = {
    labels: data.map((d) => d.status),
    datasets: [
      {
        label: "Duplicatas por status",
        data: data.map((d) => d.quantidade),
        backgroundColor: [
          "#facc15", // amarela
          "#10b981", // verde
          "#3b82f6", // azul
          "#ef4444", // vermelha
        ],
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
