import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}

export function KpiCard({ title, value, icon, className = "" }: KpiCardProps) {
  return (
    <div
      className={`bg-cards rounded-2xl shadow-md p-6 flex justify-between items-center ${className}`}
    >
      <div>
        <p className="text-text-light text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-text">{value}</p>
      </div>
      {icon && <div className="text-primary text-2xl">{icon}</div>}
    </div>
  );
}
