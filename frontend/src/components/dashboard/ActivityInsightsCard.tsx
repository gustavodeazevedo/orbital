import { ArrowUpRight } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

export interface WeeklyActivityPoint {
  readonly day: string;
  readonly value: number;
}

interface ActivityInsightsCardProps {
  readonly weeklyData: ReadonlyArray<WeeklyActivityPoint>;
  readonly confirmedCount: number;
  readonly isLoading?: boolean;
}

const ActivityInsightsCard = ({
  weeklyData,
  confirmedCount,
  isLoading = false,
}: ActivityInsightsCardProps) => {
  const maxValue = weeklyData.reduce(
    (currentMax, item) => Math.max(currentMax, item.value),
    0,
  );

  return (
    <div className="bg-surface rounded-[22px] p-6 shadow-card h-full flex flex-col border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text">Agendamentos</h3>
        <button className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center border-none">
          <ArrowUpRight className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-1">Confirmados na semana</p>
      <p className="text-4xl font-semibold text-text mb-6">{confirmedCount}</p>

      <div className="h-36 mt-auto">
        {isLoading ? (
          <div className="h-full rounded-xl bg-background-secondary animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
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
              <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.value === maxValue && maxValue > 0
                        ? "#D4FF5B"
                        : "#E9EDF1"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ActivityInsightsCard;
