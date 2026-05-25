import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { authService } from "../../services/auth/authService";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  }),
};

const inputClass =
  "w-full h-12 px-0 bg-transparent border-0 border-b border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    try {
      const message = await authService.forgotPassword({ email });
      setSuccessMessage(message);
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha ao solicitar recuperação",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-surface relative">
        <motion.div
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto"
        >
          {/* Back */}
          <motion.div variants={fadeInUp} custom={0} className="mb-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors no-underline"
            >
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>
          </motion.div>

          {submitted ? (
            /* Success state */
            <motion.div variants={fadeInUp} custom={0.05}>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                <Mail size={24} className="text-primary-active" />
              </div>
              <h1 className="text-3xl font-semibold text-text mb-3">
                Verifique seu e-mail
              </h1>
              <p className="text-base text-text-secondary mb-8 leading-relaxed">
                Recebemos sua solicitação para{" "}
                <span className="font-medium text-text">{email}</span>.{" "}
                {successMessage}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full h-12 rounded-button bg-primary text-text font-medium text-sm hover:bg-primary-hover transition-all hover:-translate-y-0.5 shadow-sm no-underline"
              >
                Voltar ao login
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full mt-4 text-sm text-text-secondary hover:text-text transition-colors bg-transparent border-none cursor-pointer"
              >
                Enviar novamente
              </button>
              <Link
                to="/reset-password"
                className="inline-flex items-center justify-center w-full mt-3 text-sm text-text-secondary hover:text-text transition-colors no-underline"
              >
                Já possui token? Redefinir senha
              </Link>
            </motion.div>
          ) : (
            /* Form state */
            <>
              {/* Header */}
              <motion.div variants={fadeInUp} custom={0.05} className="mb-10">
                <Link to="/" className="inline-block no-underline mb-6">
                  <span className="text-2xl font-extrabold text-text">
                    Orbital
                  </span>
                </Link>
                <h1 className="text-3xl font-semibold text-text mb-2">
                  Recuperar senha
                </h1>
                <p className="text-base text-text-secondary leading-relaxed">
                  Informe seu e-mail e enviaremos um link para redefinir sua
                  senha
                </p>
              </motion.div>

              <motion.form
                variants={fadeInUp}
                custom={0.1}
                onSubmit={handleSubmit}
                autoComplete="off"
                className="space-y-6"
              >
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-button bg-primary text-text font-medium text-sm hover:bg-primary-hover transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer border-none mt-4"
                >
                  {loading ? "Enviando..." : "Enviar link de recuperação"}
                </button>

                {errorMessage && (
                  <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
                )}
              </motion.form>

              <motion.p
                variants={fadeInUp}
                custom={0.15}
                className="text-sm text-text-secondary mt-8"
              >
                Lembrou a senha?{" "}
                <Link
                  to="/login"
                  className="text-text font-medium hover:underline no-underline"
                >
                  Entrar
                </Link>
              </motion.p>
            </>
          )}
        </motion.div>
      </div>

      {/* Right — Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background p-12 relative overflow-hidden">
        <img
          src="/ilustracao-forgot-password.png"
          alt="Ilustração de recuperação de senha"
          className="w-full max-w-lg object-contain rounded-card"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
