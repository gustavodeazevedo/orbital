// Modal de formulario para criar ou editar.
// Usado nas telas de clientes, servicos e agendamentos.
/*
 * Reaproveitado para varios cadastros.
 * Evita criar um modal novo para cada tela.
 */
import { useEffect } from "react";
import type { FormEvent, ReactNode } from "react";
import { X } from "lucide-react";

interface DashboardActionModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly submitLabel: string;
  readonly isSubmitting?: boolean;
  readonly errorMessage?: string;
  readonly onClose: () => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  readonly children: ReactNode;
}

const DashboardActionModal = ({
  open,
  title,
  submitLabel,
  isSubmitting = false,
  errorMessage,
  onClose,
  onSubmit,
  children,
}: DashboardActionModalProps) => {
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
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-5 py-4">
          {children}

          {errorMessage && (
            <p className="rounded-md border border-[#FFD7D7] bg-[#FFF1F1] px-3 py-2 text-sm text-[#7A1C1C]">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-button border border-border bg-transparent px-4 text-sm text-text-secondary hover:bg-background-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-button bg-primary px-4 text-sm font-medium text-text hover:bg-primary-hover disabled:opacity-60"
            >
              {isSubmitting ? "Salvando..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardActionModal;
