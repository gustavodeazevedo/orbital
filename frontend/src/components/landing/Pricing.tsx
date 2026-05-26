// Secao de precos.
// Usada no Home.
/*
 * Mostra os planos e o que cada um inclui.
 * Ajuda o usuario a escolher.
 */
import {
  motion,
  type Variants,
  useMotionValue,
  animate,
  useInView,
} from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const tiers: PricingTier[] = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "/mês",
    description: "Para quem está começando e quer testar o Orbital.",
    features: [
      "Até 30 agendamentos/mês",
      "Cadastro de clientes",
      "Cadastro de serviços",
      "Visualização de agenda",
    ],
    highlighted: false,
    cta: "Começar grátis",
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "/mês",
    description: "Para negócios que querem crescer com organização.",
    features: [
      "Agendamentos ilimitados",
      "Cadastro de clientes ilimitado",
      "Relatórios e insights",
      "Agenda avançada (dia/semana/mês)",
      "Suporte prioritário",
      "PWA instalável",
    ],
    highlighted: true,
    cta: "Assinar Pro",
  },
  {
    name: "Business",
    price: "R$ 99",
    period: "/mês",
    description: "Para negócios maiores com múltiplos profissionais.",
    features: [
      "Tudo do Pro",
      "Múltiplos operadores",
      "Relatórios avançados",
      "Exportação de dados",
      "Suporte dedicado",
      "API de integração",
    ],
    highlighted: false,
    cta: "Falar com vendas",
  },
];

// Animação de contagem para os preços
const Pricing = () => {
  const CountUp = ({
    end,
    delay = 0,
    start = false,
  }: {
    end: number;
    delay?: number;
    start?: boolean;
  }) => {
    const mv = useMotionValue(0);
    const [display, setDisplay] = useState(0);
    useEffect(() => {
      let controls: ReturnType<typeof animate> | null = null;
      if (start) {
        controls = animate(mv, end, { duration: 2.2, ease: "easeOut", delay });
      } else {
        // reset when not started
        mv.set(0);
        setDisplay(0);
      }

      const unsubscribe = mv.onChange((v) => setDisplay(Math.round(v)));
      return () => {
        unsubscribe();
        // stop animation if available
        if (controls && (controls as any).stop) (controls as any).stop();
      };
    }, [end, delay, mv, start]);

    return <>{display}</>;
  };

  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="pricing" ref={ref} className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-button bg-primary/10 text-sm font-medium text-text mb-4">
            Preços
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-text-secondary text-lg">
            Comece grátis e evolua conforme seu negócio cresce. Sem surpresas,
            sem taxas escondidas.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              variants={cardVariant}
              className={`relative flex flex-col p-7 rounded-card border transition-all duration-200 hover:-translate-y-0.5 ${
                tier.highlighted
                  ? "border-primary bg-surface shadow-card scale-[1.02]"
                  : "border-border bg-surface hover:shadow-card"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-button bg-primary text-xs font-medium text-text">
                  Mais popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-text mb-1">
                  {tier.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-text">
                    R${" "}
                    <CountUp
                      start={inView}
                      end={parseInt(tier.price.replace(/\D/g, ""))}
                      delay={0.5 + idx * 0.6}
                    />
                  </span>
                  <span className="text-sm text-text-muted">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-primary-active" />
                    </div>
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/register"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-button font-medium text-sm transition-all no-underline ${
                  tier.highlighted
                    ? "bg-primary text-text hover:bg-primary-hover"
                    : "bg-ghost text-text hover:bg-ghost-hover"
                }`}
              >
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
