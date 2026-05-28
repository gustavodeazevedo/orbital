// Cabecalho da landing com menu e botoes.
// Usado no LandingLayout.
/*
 * Mostra links principais e chamada para acao.
 * Fica fixo no topo das paginas publicas.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Preços", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed z-50 transition-all duration-500 ${
        scrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        className={`mx-auto transition-all duration-500 border ${
          scrolled
            ? "bg-surface/80 backdrop-blur-xl border-border rounded-2xl shadow-lg max-w-300"
            : "bg-transparent border-transparent max-w-350"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            scrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center no-underline">
            <span
              className={`font-extrabold transition-all duration-500 text-text ${
                scrolled ? "text-base" : "text-2xl"
              }`}
            >
              Orbital
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text transition-colors duration-300 relative group no-underline"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-text transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className={`text-text-secondary hover:text-text transition-all duration-500 no-underline ${
                scrolled ? "text-xs" : "text-sm"
              }`}
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className={`inline-flex items-center justify-center font-medium bg-text hover:bg-text/90 text-surface rounded-full transition-all duration-500 h-8 no-underline ${
                scrolled ? "px-4 text-xs" : "px-6 text-sm"
              }`}
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 bg-transparent border-none cursor-pointer z-50"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-text" />
            ) : (
              <Menu className="w-6 h-6 text-text" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-surface z-40 transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-5xl font-semibold text-text hover:text-text-muted transition-all duration-500 no-underline ${
                  mobileOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: mobileOpen ? `${(i + 1) * 75}ms` : "0ms",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div
            className={`flex gap-4 pt-8 border-t border-text/10 transition-all duration-500 ${
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              transitionDelay: mobileOpen
                ? `${(navLinks.length + 1) * 75}ms`
                : "0ms",
            }}
          >
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center flex-1 font-medium border border-border bg-surface rounded-full h-14 text-base text-text hover:bg-ghost transition-all no-underline"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center flex-1 font-medium bg-text text-surface rounded-full h-14 text-base hover:bg-text/90 transition-all no-underline"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
