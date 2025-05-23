import { KpiCard } from "@/components/dashboard/KpiCard";
import {
  FileText,
  TrendingDown,
  TrendingUp,
  BadgeDollarSign,
} from "lucide-react";
import { LineChart } from "@/components/dashboard/LineChart";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const [total, vencidas, pagas, pendentes] = await Promise.all([
    prisma.duplicata.count(),
    prisma.duplicata.count({
      where: { vencimento: { lt: new Date() }, status: "PENDENTE" },
    }),
    prisma.duplicata.count({ where: { status: "PAGA" } }),
    prisma.duplicata.count({ where: { status: "PENDENTE" } }),
  ]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
      <Link href="/duplicatas">
        <KpiCard
          title="Duplicatas Digitadas"
          value={total.toString()}
          icon={<FileText />}
        />
      </Link>

      <Link href="/duplicatas?status=PENDENTE">
        <KpiCard
          title="Pendentes"
          value={pendentes.toString()}
          icon={<TrendingUp />}
        />
      </Link>

      <Link href="/duplicatas?status=PAGA">
        <KpiCard
          title="Liquidadas"
          value={pagas.toString()}
          icon={<BadgeDollarSign />}
        />
      </Link>

      <Link href="/duplicatas?status=VENCIDA">
        <KpiCard
          title="Vencidas"
          value={vencidas.toString()}
          icon={<TrendingDown />}
        />
      </Link>

      <div className="col-span-full">
        <LineChart />
      </div>

      <Link href="/borderos">
        <KpiCard title="Borderôs Gerados" value="↗ Clique para ver" />
      </Link>
    </div>
  );
}
