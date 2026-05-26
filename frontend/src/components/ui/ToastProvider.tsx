// Notificacoes rapidas para toda a interface.
// Usado no main.tsx.
/*
 * Centraliza o uso de toasts para qualquer tela.
 * Evita criar logica de aviso em cada pagina.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

interface ToastProviderProps {
  readonly children: ReactNode;
}

const ToastContext = createContext<ToastApi | null>(null);

const createToastId = (): string =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (type: ToastType, message: string) => {
      const id = createToastId();
      setToasts((previous) => [...previous, { id, type, message }]);

      window.setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const toastApi = useMemo<ToastApi>(
    () => ({
      success: (message) => pushToast("success", message),
      error: (message) => pushToast("error", message),
      info: (message) => pushToast("info", message),
    }),
    [pushToast],
  );

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <div className="fixed right-4 top-4 z-150 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start justify-between gap-3 rounded-card border px-4 py-3 text-sm shadow-sm transition ${
              toast.type === "success"
                ? "border-[#CFF3D6] bg-[#ECFDF3] text-[#166534]"
                : toast.type === "error"
                  ? "border-[#FFD7D7] bg-[#FFF1F1] text-[#7A1C1C]"
                  : "border-[#CFE4FF] bg-[#EFF6FF] text-[#1E3A8A]"
            }`}
          >
            <span className="leading-relaxed">{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-current hover:border-current"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastApi => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export default ToastProvider;
