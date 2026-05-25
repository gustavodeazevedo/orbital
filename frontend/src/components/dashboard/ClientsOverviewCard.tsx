import { ArrowUpRight } from "lucide-react";
import {
  Area,
  Bar,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export interface WeeklyClientsPoint {
  readonly day: string;
  readonly novos: number;
  readonly recorrentes: number;
}

interface ClientsOverviewCardProps {
  readonly weeklyData: ReadonlyArray<WeeklyClientsPoint>;
  readonly newClientsWeek: number;
  readonly recurringClients: number;
  readonly isLoading?: boolean;
}

const ClientsOverviewCard = ({
  weeklyData,
  newClientsWeek,
  recurringClients,
  isLoading = false,
}: ClientsOverviewCardProps) => {
  const maxNewClients = weeklyData.reduce(
    (currentMax, item) => Math.max(currentMax, item.novos),
    0,
  );

  return (
    <div className="bg-surface rounded-[22px] p-6 shadow-card h-full flex flex-col border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text">Clientes</h3>
        <button className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center border-none">
          <ArrowUpRight className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-1">Novos vs recorrentes</p>
      <div className="flex items-baseline gap-2 mb-1">
        <p className="text-4xl font-semibold text-text">{newClientsWeek}</p>
      </div>
      <p className="text-sm text-text-secondary mb-4">novos esta semana</p>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">
            {recurringClients}
          </span>
          <span className="text-sm text-text-secondary">recorrentes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text">
            {newClientsWeek}
          </span>
          <span className="text-sm text-text-secondary">novos</span>
        </div>
      </div>

      <div className="h-40 mt-auto">
        {isLoading ? (
          <div className="h-full rounded-xl bg-background-secondary animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={weeklyData} barCategoryGap="25%">
              <defs>
                <linearGradient
                  id="clientsAreaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#D4FF5B" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#D4FF5B" stopOpacity={0.02} />
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
              <Bar dataKey="novos" radius={[4, 4, 0, 0]} barSize={22}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.novos === maxNewClients && maxNewClients > 0
                        ? "#D4FF5B"
                        : "#E9EDF1"
                    }
                  />
                ))}
              </Bar>
              <Area
                type="monotone"
                dataKey="recorrentes"
                stroke="#1f2937"
                strokeWidth={1.5}
                fill="url(#clientsAreaGrad)"
                dot={{
                  r: 3,
                  fill: "#fff",
                  stroke: "#1f2937",
                  strokeWidth: 1.5,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ClientsOverviewCard;
