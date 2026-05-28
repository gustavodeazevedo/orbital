// Card de comparacao de agendamentos.
// Usado no DashboardHome.
/*
 * Mostra o comparativo entre periodos.
 * Ajuda a ver se houve melhora ou queda.
 */
import { ArrowUpRight, Clock3, Smile } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export interface WeeklyComparisonPoint {
  readonly day: string;
  readonly agendados: number;
  readonly concluidos: number;
}

interface AppointmentsComparisonCardProps {
  readonly weeklyData: ReadonlyArray<WeeklyComparisonPoint>;
  readonly totalAppointments: number;
  readonly completionRate: number;
  readonly isLoading?: boolean;
}

const AppointmentsComparisonCard = ({
  weeklyData,
  totalAppointments,
  completionRate,
  isLoading = false,
}: AppointmentsComparisonCardProps) => {
  return (
    <div className="bg-surface rounded-[22px] p-6 shadow-card h-full flex flex-col border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text">
          Comparação de agendamentos
        </h3>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center border-none">
            <Smile className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center border-none">
            <Clock3 className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center border-none">
            <ArrowUpRight className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-1">
        Agendados vs concluídos
      </p>
      <p className="text-4xl font-semibold text-text mb-4">
        {totalAppointments}
        <span className="text-xl text-text-secondary"> total</span>
      </p>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-active" />
          <span className="text-xs text-text-secondary">Agendados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-text/25" />
          <span className="text-xs text-text-secondary">Concluídos</span>
        </div>
      </div>

      <div className="relative mt-auto">
        <div className="h-36">
          {isLoading ? (
            <div className="h-full rounded-xl bg-background-secondary animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <pattern
                    id="diagonalHatchOrbital"
                    patternUnits="userSpaceOnUse"
                    width="4"
                    height="4"
                  >
                    <path
                      d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"
                      style={{
                        stroke: "#6b7280",
                        strokeWidth: 0.5,
                        opacity: 0.3,
                      }}
                    />
                  </pattern>
                  <linearGradient
                    id="orbitalGreenGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#D4FF5B" stopOpacity={0.4} />
                    <stop
                      offset="100%"
                      stopColor="#D4FF5B"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="concluidos"
                  stroke="#7A8493"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#diagonalHatchOrbital)"
                  fillOpacity={0.4}
                />
                <Area
                  type="monotone"
                  dataKey="agendados"
                  stroke="#A3C43A"
                  strokeWidth={2}
                  fill="url(#orbitalGreenGrad)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsComparisonCard;
