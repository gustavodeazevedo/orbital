// Primeira secao da landing com chamada principal.
// Usado no Home.
/*
 * Mostra a proposta de valor de forma direta.
 * Traz o botao principal de cadastro.
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import RotatingText from "../ui/RotatingText";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Animated background blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* top-left — atrás do conteúdo de texto */}
        <div className="animate-blob-a absolute -top-24 -left-16 w-120 h-120 rounded-full bg-primary/[0.07] blur-[96px]" />
        {/* center-right — atrás do logo */}
        <div className="animate-blob-b absolute top-1/3 -right-16 w-96 h-96 rounded-full bg-primary/5 blur-[80px]" />
        {/* centro sutil — preenche o espaço entre as colunas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/4 blur-[96px]" />
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-5 md:pt-32 md:pb-5">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left column — text content */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-button bg-primary/10 text-sm font-medium text-text mb-8"
            >
              <Sparkles size={14} className="text-primary-active" />
              Agendamento do futuro para seu negócio
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={0.1}
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-text mb-6"
            >
              Organize{" "}
              <RotatingText
                texts={[
                  "sua agenda.",
                  "seus clientes.",
                  "seus serviços.",
                  "agendamentos.",
                ]}
                boxed
                boxClassName="inline-block bg-primary/10 px-5 rounded-button"
                mainClassName="inline-block text-transparent bg-clip-text bg-linear-to-r from-primary-active to-primary"
                splitBy="words"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />{" "}
              <span className="sr-only">Cresça seu negócio.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.2}
              variants={fadeInUp}
              className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl"
            >
              Pare de perder clientes por falta de organização. O Orbital é a
              plataforma de agendamento mais simples para barbearias, clínicas,
              estúdios e consultórios.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.3}
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-button bg-primary text-text font-medium hover:bg-primary-hover transition-all hover:-translate-y-0.5 shadow-sm no-underline"
              >
                Começar grátis
                <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-button bg-ghost text-text-secondary font-medium hover:bg-ghost-hover transition-colors no-underline"
              >
                Ver funcionalidades
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.4}
              variants={fadeInUp}
              className="mt-10 text-sm text-text-muted"
            >
              Usado por profissionais em todo o Brasil
            </motion.p>
          </div>

          {/* Right column — Orbital logo with rotation animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="flex-1 min-w-0 flex items-center justify-center"
          >
            <img
              src="/orbital-logo.png"
              alt="Orbital Logo"
              className="w-64 md:w-80 lg:w-105 drop-shadow-2xl animate-spin-slow"
              draggable={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
