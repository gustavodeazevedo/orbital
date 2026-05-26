// Tela para criar uma nova senha.
// Usa o authService e volta para o login.
/*
 * Recebe o codigo da URL e a nova senha.
 * Ao salvar, volta para a tela de login.
 */
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromLink = useMemo(
    () => searchParams.get("token") ?? "",
    [searchParams],
  );

  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const handleCopyToken = async () => {
    if (!tokenFromLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(tokenFromLink);
      setCopyMessage("Token copiado. Cole no campo abaixo.");
    } catch {
      setCopyMessage(
        "Não foi possível copiar automaticamente. Copie manualmente no e-mail.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const message = await authService.resetPassword({ token, novaSenha });
      setSuccessMessage(message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Falha ao redefinir senha",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-surface relative">
        <motion.div
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto"
        >
          <motion.div variants={fadeInUp} custom={0} className="mb-10">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors no-underline"
            >
              <ArrowLeft size={16} />
              Voltar ao login
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} custom={0.05} className="mb-10">
            <Link to="/" className="inline-block no-underline mb-6">
              <span className="text-2xl font-extrabold text-text">Orbital</span>
            </Link>
            <h1 className="text-3xl font-semibold text-text mb-2">
              Redefinir senha
            </h1>
            <p className="text-base text-text-secondary leading-relaxed">
              Informe o token de recuperação e sua nova senha.
            </p>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            custom={0.1}
            onSubmit={handleSubmit}
            autoComplete="off"
            className="space-y-6"
          >
            {tokenFromLink && (
              <div className="rounded-card border border-border bg-background p-4">
                <p className="text-sm text-text-secondary mb-3">
                  O token veio no link do e-mail, mas por segurança ele não é
                  preenchido automaticamente.
                </p>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="h-10 px-4 rounded-button bg-background border border-border text-text text-sm hover:border-primary transition-colors cursor-pointer"
                >
                  Copiar token do link
                </button>
                {copyMessage && (
                  <p className="text-xs text-text-secondary mt-2">
                    {copyMessage}
                  </p>
                )}
              </div>
            )}

            <div>
              <input
                id="token"
                name="token"
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Token de recuperação"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <input
                id="novaSenha"
                name="novaSenha"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Nova senha (mínimo 8 caracteres)"
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
              className="w-full h-12 rounded-button bg-primary text-text font-medium text-sm hover:bg-primary-hover transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer border-none mt-4"
            >
              {loading ? "Redefinindo..." : "Redefinir senha"}
            </button>

            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}
          </motion.form>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-background p-12 relative overflow-hidden">
        <img
          src="/ilustracao-forgot-password.png"
          alt="Ilustração de redefinição de senha"
          className="w-full max-w-lg object-contain rounded-card"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
