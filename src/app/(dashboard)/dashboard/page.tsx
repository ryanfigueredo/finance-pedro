import { KpiCard } from "@/components/dashboard/KpiCard";
import { FileText, Star } from "lucide-react";
import { LineChart } from "@/components/dashboard/LineChart";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <KpiCard title="Total de duplicatas" value="1.254" icon={<FileText />} />
      <KpiCard title="Valor emitido" value="R$ 45.900,00" />
      <KpiCard title="Score médio" value="82 / 100" icon={<Star />} />

      <LineChart />
    </div>
  );
}
