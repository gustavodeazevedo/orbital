import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

const Cta = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 32 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative rounded-card bg-text overflow-hidden p-10 md:p-16 text-center"
        >
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              custom={0}
              variants={fadeInUp}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-surface mb-4"
            >
              Pronto para organizar sua agenda?
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              custom={0.1}
              variants={fadeInUp}
              viewport={{ once: true }}
              className="text-text-muted text-lg mb-8 leading-relaxed"
            >
              Junte-se a centenas de negócios que já simplificaram seus
              agendamentos com o Orbital. Comece grátis, sem cartão de crédito.
            </motion.p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-button bg-primary text-text font-medium hover:bg-primary-hover transition-all hover:-translate-y-0.5 no-underline"
            >
              <motion.span
                initial="hidden"
                whileInView="visible"
                custom={0.2}
                variants={fadeInUp}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2"
              >
                Criar conta grátis
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;
