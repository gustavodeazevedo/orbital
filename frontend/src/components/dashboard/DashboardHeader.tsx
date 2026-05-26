// Topo do dashboard com perfil e sair.
// Usado no DashboardLayout.
/*
 * Mostra o nome do operador e a opcao de sair.
 * Mantem o topo igual em todas as paginas internas.
 */
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  readonly activeSectionLabel: string;
  readonly operatorName?: string;
  readonly onLogout: () => Promise<void>;
}

const DashboardHeader = ({
  activeSectionLabel,
  operatorName,
  onLogout,
}: DashboardHeaderProps) => {
  const initials = operatorName
    ? operatorName
        .split(" ")
        .filter((part) => part.length > 0)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "OP";

  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1">
          <button className="px-4 py-2.5 rounded-button bg-text text-surface text-sm font-medium inline-flex items-center gap-2 border-none">
            <span className="grid grid-cols-2 gap-0.5">
              <span className="w-1.5 h-1.5 rounded-sm bg-surface" />
              <span className="w-1.5 h-1.5 rounded-sm bg-surface" />
              <span className="w-1.5 h-1.5 rounded-sm bg-surface" />
              <span className="w-1.5 h-1.5 rounded-sm bg-surface" />
            </span>
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLogout}
            className="liquid-glass-chip-primary h-9 px-3 rounded-button bg-primary text-text text-sm font-medium border-none cursor-pointer hover:bg-primary-hover transition-colors inline-flex items-center gap-1.5"
          >
            <LogOut size={14} />
            Sair
          </button>
          <span className="liquid-glass-chip inline-flex items-center gap-2 rounded-button px-2.5 py-1.5 text-xs text-text">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-text text-surface font-semibold">
              {initials}
            </span>
            <span className="max-w-35 truncate">
              {operatorName ?? "Operador"}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
            Visão do negócio
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-text">
            {activeSectionLabel}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
