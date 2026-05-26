// Rodape da landing com links.
// Usado no LandingLayout.
/*
 * Mostra links e informacoes institucionais.
 * Fecha a pagina com um resumo do produto.
 */
import { motion } from "framer-motion";

const footerLinks = {
  produto: [
    { label: "Funcionalidades", href: "#features" },
    { label: "Preços", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  empresa: [
    { label: "Sobre", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#" },
  ],
  legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Privacidade", href: "#" },
  ],
};

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-60px" }}
      className="bg-text text-surface"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-text font-semibold text-sm">O</span>
              </div>
              <span className="text-lg font-semibold text-surface">
                Orbital
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Agendamento inteligente para pequenos negócios. Simples, rápido e
              organizado.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-surface mb-4">Produto</h4>
            <ul className="space-y-2.5">
              {footerLinks.produto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-surface transition-colors no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-surface mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-surface transition-colors no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-surface mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-surface transition-colors no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Orbital. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
