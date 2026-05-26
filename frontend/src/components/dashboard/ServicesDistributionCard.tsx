// Card com servicos mais usados.
// Usado no DashboardHome.
/*
 * Mostra quais servicos aparecem mais.
 * Ajuda a entender a demanda.
 */
import { ArrowUpRight } from "lucide-react";

interface ServiceDistributionItem {
  readonly nome: string;
  readonly percentual: number;
}

interface ServicesDistributionCardProps {
  readonly totalServices: number;
  readonly topServices: ReadonlyArray<ServiceDistributionItem>;
  readonly isLoading?: boolean;
}

const ServicesDistributionCard = ({
  totalServices,
  topServices,
  isLoading = false,
}: ServicesDistributionCardProps) => {
  return (
    <div className="bg-surface rounded-[22px] p-6 shadow-card h-full flex flex-col border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text">Serviços</h3>
        <button className="w-8 h-8 rounded-lg bg-background-secondary flex items-center justify-center border-none">
          <ArrowUpRight className="w-3.5 h-3.5 text-text-secondary" />
        </button>
      </div>

      <p className="text-sm text-text-secondary mb-1">
        Total de serviços ativos
      </p>
      <p className="text-3xl font-semibold text-text mb-1">{totalServices}</p>
      <p className="text-sm text-text-secondary mb-8">Top serviços por uso</p>

      <div className="space-y-4 mt-auto">
        {isLoading ? (
          <div className="h-20 rounded-xl bg-background-secondary animate-pulse" />
        ) : topServices.length === 0 ? (
          <p className="text-sm text-text-secondary">
            Sem dados de agendamento para distribuição de serviços.
          </p>
        ) : (
          topServices.map((service, index) => (
            <div key={`${service.nome}-${index}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text font-medium">
                  {service.nome}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    index === 0
                      ? "bg-primary text-text"
                      : "bg-background-secondary text-text"
                  }`}
                >
                  {service.percentual}%
                </span>
              </div>
              <div className="h-2.5 bg-background-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    index === 0 ? "bg-primary" : "bg-text/15"
                  }`}
                  style={{ width: `${service.percentual}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServicesDistributionCard;
