import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export interface BottomDockItem {
  readonly key: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly to?: string;
  readonly onClick?: () => void;
}

interface BottomDockProps {
  readonly items: ReadonlyArray<BottomDockItem>;
  readonly activeKey: string;
  readonly reserveSpace?: boolean;
}

const BottomDock = ({
  items,
  activeKey,
  reserveSpace = true,
}: BottomDockProps) => {
  return (
    <>
      {reserveSpace && <div aria-hidden="true" className="h-24 md:h-28" />}

      <nav className="fixed left-1/2 -translate-x-1/2 bottom-5 z-40 w-[95vw] max-w-2xl rounded-button border border-border bg-surface/95 shadow-float backdrop-blur px-2 py-2">
        <ul className="grid grid-cols-4 gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            const baseClass = `w-full h-12 rounded-button text-[10px] md:text-xs font-medium transition-colors inline-flex flex-col items-center justify-center gap-0.5 ${
              isActive
                ? "bg-primary text-text"
                : "bg-transparent text-text-secondary hover:bg-background-secondary"
            }`;

            return (
              <li key={item.key}>
                {item.to ? (
                  <Link to={item.to} className={`${baseClass} no-underline`}>
                    <Icon size={15} />
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={`${baseClass} border-none cursor-pointer`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default BottomDock;
