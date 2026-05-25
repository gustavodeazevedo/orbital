import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "O Orbital funciona para qual tipo de negócio?",
    answer:
      "O Orbital foi feito para qualquer pequeno negócio que trabalha com agendamentos: barbearias, clínicas, estúdios de tatuagem, consultórios, salões de beleza e muito mais.",
  },
  {
    question: "Preciso instalar alguma coisa?",
    answer:
      'Não! O Orbital funciona direto no navegador. Além disso, é um PWA — você pode "instalar" no celular como se fosse um aplicativo, sem precisar baixar pela loja.',
  },
  {
    question: "Posso usar o plano grátis para sempre?",
    answer:
      "Sim! O plano grátis é permanente, com limite de 30 agendamentos por mês. Quando quiser mais, é só fazer upgrade.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer:
      "Sim. Utilizamos autenticação JWT, validação de dados em todas as entradas e boas práticas de segurança para proteger suas informações.",
  },
  {
    question: "Consigo ver relatórios do meu negócio?",
    answer:
      "No plano Pro e superior, você tem acesso a insights como horários mais agendados, serviços mais procurados e histórico de atendimentos por cliente.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-surface">
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-button bg-primary/10 text-sm font-medium text-text mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-text-secondary text-lg">
            Tire suas dúvidas sobre o Orbital.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-3"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="rounded-card border border-border bg-surface overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-transparent border-none cursor-pointer"
              >
                <span className="text-sm font-medium text-text pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-text-muted shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
