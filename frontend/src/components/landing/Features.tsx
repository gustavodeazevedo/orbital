import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  Users,
  BarChart3,
  Clock,
  Smartphone,
  Shield,
} from "lucide-react";
import CardSwap, { Card } from "../ui/CardSwap";

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const features = [
  {
    icon: Calendar,
    title: "Agenda inteligente",
    description:
      "Visualize seus agendamentos por dia, semana ou mês. Controle total da sua agenda em um só lugar.",
  },
  {
    icon: Users,
    title: "Gestão de clientes",
    description:
      "Cadastre clientes, acompanhe o histórico de atendimentos e construa relacionamentos duradouros.",
  },
  {
    icon: Clock,
    title: "Agendamento rápido",
    description:
      "Crie, edite ou cancele agendamentos em poucos cliques. Sem complicação, sem conflito de horários.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e insights",
    description:
      "Entenda sua demanda com dados: horários mais procurados, serviços populares e mais.",
  },
  {
    icon: Smartphone,
    title: "Funciona no celular",
    description:
      "PWA instalável — use como aplicativo no seu celular sem precisar baixar na loja.",
  },
  {
    icon: Shield,
    title: "Seguro e confiável",
    description:
      "Seus dados protegidos com autenticação segura e práticas modernas de segurança.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-20 md:py-28 bg-surface overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-16">
          {/* Illustration */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.8 }}
            className="flex-1 flex items-center justify-center order-last lg:order-first"
          >
            <img
              src="/ilustracao-orbital.png"
              alt="Ilustração do sistema de agendamento Orbital"
              className="w-full max-w-sm lg:max-w-md rounded-2xl drop-shadow-xl"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block px-4 py-1.5 rounded-button bg-primary/10 text-sm font-medium text-text mb-4">
              Saiba mais
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
              Tudo que você precisa para organizar seu negócio
            </h2>
            <p className="text-text-secondary text-lg">
              Ferramentas simples e poderosas para gerenciar agendamentos,
              clientes e serviços do seu dia a dia.
            </p>
          </motion.div>
        </div>

        {/* Feature CardSwap */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left: text */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="inline-block px-4 py-1.5 rounded-button bg-primary/10 text-sm font-medium text-text mb-4">
              Funcionalidades
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
              Uma tela para cada etapa do seu negócio
            </h2>
            <p className="text-text-secondary text-lg mb-6">
              Do agendamento ao relatório — explore as funcionalidades do
              Orbital e veja como é simples organizar tudo em um só lugar.
            </p>
            <ul className="space-y-3 text-left inline-flex flex-col">
              {features.map((f) => (
                <li
                  key={f.title}
                  className="flex items-center gap-3 text-sm text-text-secondary"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <f.icon size={13} className="text-primary-active" />
                  </span>
                  {f.title}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: CardSwap */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex-1 relative w-full"
            style={{ minHeight: "520px" }}
          >
            <CardSwap
              cardDistance={60}
              verticalDistance={70}
              delay={7000}
              pauseOnHover
              width={460}
              height={360}
            >
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-white border border-[#E6E6E6] overflow-hidden shadow-[0px_16px_40px_rgba(0,0,0,0.10)] flex flex-col"
                >
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-[#F5F6F7] border-b border-[#EFEFEF] shrink-0">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                    <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                    <div className="flex-1 mx-2 h-6 rounded-full bg-white border border-[#E6E6E6] flex items-center px-3">
                      <span className="text-xs text-[#9CA3AF]">
                        orbital.app
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex flex-col gap-4 p-7 flex-1">
                    <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center">
                      <feature.icon size={22} className="text-primary-active" />
                    </div>
                    <h3 className="text-base font-semibold text-text">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
