// Secao sobre o App Mobile (PWA).
// Usada no Home.
/*
 * Mostra os beneficios de usar o app no celular.
 * Permite a instalacao do PWA.
 */
import { motion, type Variants } from "framer-motion";
import { Download, Smartphone, Zap, Bell, CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const MobileApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert(
        "Seu navegador não suporta a instalação direta ou o app já está instalado. Para instalar no iOS, abra no Safari, toque em 'Compartilhar' e depois em 'Adicionar à Tela de Início'.",
      );
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <section
      id="mobile-app"
      className="py-20 md:py-28 bg-surface border-y border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="max-w-xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-button bg-primary/10 text-sm font-medium text-text mb-4">
                <Smartphone size={16} /> Aplicativo Mobile
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text mb-4 leading-tight">
                Seu negócio na palma da mão
              </h2>
              <p className="text-text-secondary text-lg">
                Gerencie agendamentos, clientes e serviços de qualquer lugar.
                Instale o aplicativo Orbital no seu celular para uma experiência
                rápida e nativa.
              </p>
            </motion.div>

            <div className="space-y-6 mb-10">
              <motion.div variants={itemVariant} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm border border-border">
                  <Zap size={18} className="text-text" />
                </div>
                <div>
                  <h4 className="text-text font-medium mb-1">Rápido e Leve</h4>
                  <p className="text-sm text-text-secondary">
                    Não ocupa espaço na memória do seu celular e carrega
                    instantaneamente.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariant} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm border border-border">
                  <CalendarClock size={18} className="text-text" />
                </div>
                <div>
                  <h4 className="text-text font-medium mb-1">Acesso Offline</h4>
                  <p className="text-sm text-text-secondary">
                    Consulte sua agenda mesmo quando estiver sem conexão com a
                    internet.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariant} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm border border-border">
                  <Bell size={18} className="text-text" />
                </div>
                <div>
                  <h4 className="text-text font-medium mb-1">
                    Experiência Nativa
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Acesse o Orbital direto da tela inicial do seu smartphone
                    com um toque.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp}>
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-button bg-primary text-text font-medium transition-all hover:bg-primary-hover shadow-sm"
              >
                <Download size={18} />
                Instalar Aplicativo
              </button>
              <p className="text-xs text-text-muted mt-4">
                Compatível com iOS e Android. Nenhuma loja de aplicativos
                necessária.
              </p>
            </motion.div>
          </motion.div>

          {/* Visual/Image Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-60px" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-[280px] h-[580px] rounded-[40px] border-[8px] border-[#1f2937] bg-surface shadow-2xl overflow-hidden flex flex-col">
              {/* Phone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1f2937] rounded-b-xl z-20"></div>

              {/* Fake App UI */}
              <div className="flex-1 bg-background-secondary p-4 pt-10 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="h-3 w-20 bg-text/10 rounded-full mb-2"></div>
                    <div className="h-5 w-32 bg-text/20 rounded-full"></div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-text/10"></div>
                </div>

                <div className="bg-surface rounded-card p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <CalendarClock
                        size={14}
                        className="text-primary-active"
                      />
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-text/20 rounded-full mb-1"></div>
                      <div className="h-2 w-16 bg-text/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-text/10 rounded-full mb-2"></div>
                  <div className="h-2 w-3/4 bg-text/10 rounded-full"></div>
                </div>

                <div className="bg-surface rounded-card p-4 shadow-sm border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-text/10 flex items-center justify-center">
                      <Smartphone size={14} className="text-text-secondary" />
                    </div>
                    <div>
                      <div className="h-3 w-28 bg-text/20 rounded-full mb-1"></div>
                      <div className="h-2 w-20 bg-text/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-text/10 rounded-full mb-2"></div>
                  <div className="h-2 w-1/2 bg-text/10 rounded-full"></div>
                </div>

                <div className="mt-auto flex justify-around bg-surface p-3 rounded-card border border-border shadow-sm">
                  <div className="w-6 h-6 rounded bg-primary"></div>
                  <div className="w-6 h-6 rounded bg-text/10"></div>
                  <div className="w-6 h-6 rounded bg-text/10"></div>
                  <div className="w-6 h-6 rounded bg-text/10"></div>
                </div>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
