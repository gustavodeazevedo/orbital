import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
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

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    nomeNegocio: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      await authService.register(form);
      await authService.login({ email: form.email, senha: form.senha });
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Falha ao criar conta",
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
          <motion.div variants={fadeInUp} custom={0} className="mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors no-underline"
            >
              <ArrowLeft size={16} />
              Voltar ao início
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div variants={fadeInUp} custom={0.05} className="mb-6">
            <Link to="/" className="inline-block no-underline mb-4">
              <span className="text-2xl font-extrabold text-text">Orbital</span>
            </Link>
            <h1 className="text-3xl font-semibold text-text mb-2">
              Crie sua conta
            </h1>
            <p className="text-base text-text-secondary">
              Comece a organizar seus agendamentos agora
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={fadeInUp}
            custom={0.1}
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-3.5"
          >
            <div>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={form.nome}
                onChange={handleChange}
                placeholder="Nome completo"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className={inputClass}
              />
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="E-mail"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className={inputClass}
              />
            </div>

            <div>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className={inputClass}
              />
            </div>

            <div>
              <input
                id="nomeNegocio"
                name="nomeNegocio"
                type="text"
                value={form.nomeNegocio}
                onChange={handleChange}
                placeholder="Nome do negócio"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <input
                id="senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                required
                value={form.senha}
                onChange={handleChange}
                placeholder="Senha (mínimo 8 caracteres)"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer p-2"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-button bg-primary text-text font-medium text-sm hover:bg-primary-hover transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer border-none mt-3"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            {errorMessage && (
              <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
            )}
          </motion.form>

          {/* Footer */}
          <motion.p
            variants={fadeInUp}
            custom={0.15}
            className="text-sm text-text-secondary mt-4"
          >
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-text font-medium hover:underline no-underline"
            >
              Entrar
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right — Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background p-12 relative overflow-hidden">
        <img
          src="/ilustracao-register.png"
          alt="Ilustração de cadastro"
          className="w-full max-w-lg object-contain rounded-card"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Register;
