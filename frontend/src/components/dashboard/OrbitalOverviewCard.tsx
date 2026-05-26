// Card com resumo e dicas do dashboard.
// Usado no DashboardHome.
/*
 * Traz um resumo geral e sugestoes simples.
 * Serve como visao rapida do negocio.
 */
import { Bot, Clock3, Lightbulb, Sparkles, TrendingUp } from "lucide-react";

export type AIInsightImpact = "alto" | "medio" | "baixo";

export interface AIInsightItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly impact: AIInsightImpact;
  readonly confidence: number;
}

interface OrbitalOverviewCardProps {
  readonly insights?: ReadonlyArray<AIInsightItem>;
  readonly recommendations?: ReadonlyArray<string>;
  readonly isLoading?: boolean;
  readonly lastUpdatedLabel?: string;
}

const impactStyles: Record<AIInsightImpact, string> = {
  alto: "bg-[#FFE7E7] text-[#B3261E]",
  medio: "bg-[#FFF4DF] text-[#B16A00]",
  baixo: "bg-[#EAF6EC] text-[#2F7A3E]",
};

const OrbitalOverviewCard = ({
  insights = [],
  recommendations = [],
  isLoading = false,
  lastUpdatedLabel = "Atualizado agora",
}: OrbitalOverviewCardProps) => {
  return (
    <article className="bg-surface rounded-[22px] p-5 md:p-6 border border-border h-full flex flex-col shadow-card">
      <div className="rounded-2xl p-4 mb-4 bg-[linear-gradient(125deg,#101113,#1F232B)] text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight mb-1">
              Panorama Orbital
            </h3>
            <p className="text-sm text-white/75">
              Insights gerados por IA para apoiar decisões operacionais.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/85">
            <Bot size={12} /> IA
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/75">
          <span className="inline-flex items-center gap-1">
            <Clock3 size={12} /> {lastUpdatedLabel}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles size={12} /> {insights.length} insight(s)
          </span>
        </div>
      </div>

      <section className="mb-4">
        <h4 className="text-xs uppercase tracking-wide text-text-muted mb-2">
          Insights de dados
        </h4>

        {isLoading ? (
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-background-secondary animate-pulse" />
            <div className="h-16 rounded-xl bg-background-secondary animate-pulse" />
            <div className="h-16 rounded-xl bg-background-secondary animate-pulse" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {insights.length === 0 ? (
              <p className="text-sm text-text-secondary rounded-xl border border-border bg-white p-3">
                Ainda não há dados suficientes para gerar insights confiáveis.
              </p>
            ) : (
              insights.map((insight) => (
                <article
                  key={insight.id}
                  className="rounded-xl border border-border bg-white p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-semibold text-text leading-tight">
                      {insight.title}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full ${impactStyles[insight.impact]}`}
                    >
                      impacto {insight.impact}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {insight.description}
                  </p>
                  <p className="mt-2 text-[11px] text-text-muted">
                    Confiança do modelo: <strong>{insight.confidence}%</strong>
                  </p>
                </article>
              ))
            )}
          </div>
        )}
      </section>

      <section className="mt-auto rounded-xl border border-border bg-background-secondary p-3.5">
        <p className="text-xs uppercase tracking-wide text-text-muted mb-2 inline-flex items-center gap-1">
          <Lightbulb size={12} /> Recomendações sugeridas
        </p>
        <div className="space-y-2">
          {recommendations.length === 0 ? (
            <p className="text-sm text-text-secondary">
              As recomendações aparecerão conforme o histórico real de uso.
            </p>
          ) : (
            recommendations.map((item, index) => (
              <p
                key={`${item}-${index}`}
                className="text-sm text-text leading-relaxed inline-flex items-start gap-2"
              >
                <TrendingUp className="w-4 h-4 mt-0.5 text-text-secondary" />
                <span>{item}</span>
              </p>
            ))
          )}
        </div>
      </section>
    </article>
  );
};

export default OrbitalOverviewCard;
