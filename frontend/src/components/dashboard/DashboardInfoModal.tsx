// Modal simples para mostrar detalhes.
// Usado nas telas do dashboard.
/*
 * Exibe informacoes extras sem sair da tela.
 * Mantem a experiencia mais leve.
 */
import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface DashboardInfoModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

const DashboardInfoModal = ({
  open,
  title,
  onClose,
  children,
}: DashboardInfoModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-lg rounded-card border border-border bg-surface shadow-card">
        <div className="flex items-center justify-between border-b border-divider px-5 py-4">
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-transparent text-text-secondary hover:bg-background-secondary"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        <div className="flex justify-end border-t border-divider px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-button border border-border bg-transparent px-4 text-sm text-text-secondary hover:bg-background-secondary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardInfoModal;
