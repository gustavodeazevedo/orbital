import { CalendarDays, LayoutGrid, Settings, Users } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface DashboardSidebarProps {
  readonly activeSection: "inicio" | "agendamentos" | "clientes" | "servicos";
  readonly onSelectSection: (
    section: "inicio" | "agendamentos" | "clientes" | "servicos",
  ) => void;
}

const DashboardSidebar = ({
  activeSection,
  onSelectSection,
}: DashboardSidebarProps) => {
  const dockRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const currentPointerRef = useRef<{ x: number; y: number } | null>(null);
  const targetPointerRef = useRef<{ x: number; y: number } | null>(null);
  const intensityRef = useRef(0);
  const targetIntensityRef = useRef(0);

  const mainNavItems = useMemo(
    () =>
      [
        { key: "inicio", icon: LayoutGrid, label: "Início" },
        { key: "agendamentos", icon: CalendarDays, label: "Agendamentos" },
        { key: "clientes", icon: Users, label: "Clientes" },
        { key: "servicos", icon: Settings, label: "Serviços" },
      ] as const,
    [],
  );

  const dockItems = useMemo(() => [...mainNavItems], [mainNavItems]);

  const stopAnimationFrame = () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  };

  const animateDock = () => {
    const pointerTarget = targetPointerRef.current;
    const pointerCurrent = currentPointerRef.current;

    if (pointerTarget) {
      if (!pointerCurrent) {
        currentPointerRef.current = { ...pointerTarget };
      } else {
        currentPointerRef.current = {
          x: pointerCurrent.x + (pointerTarget.x - pointerCurrent.x) * 0.25,
          y: pointerCurrent.y + (pointerTarget.y - pointerCurrent.y) * 0.25,
        };
      }
    }

    intensityRef.current +=
      (targetIntensityRef.current - intensityRef.current) * 0.18;

    const current = currentPointerRef.current;
    const sigma = 68;
    const maxScale = 1.42;
    const maxLift = 4;

    buttonRefs.current.forEach((button) => {
      if (!button || !current) {
        if (button) {
          button.style.transform = "translate3d(0, 0px, 0) scale(1)";
          button.style.zIndex = "1";
        }
        return;
      }

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(current.x - centerX, current.y - centerY);

      const gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));
      const influence = gaussian * intensityRef.current;
      const scale = 1 + influence * (maxScale - 1);
      const lift = -influence * maxLift;

      button.style.transform = `translate3d(0, ${lift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      button.style.zIndex = `${Math.round(scale * 100)}`;
    });

    const shouldContinue =
      targetPointerRef.current !== null ||
      intensityRef.current > 0.01 ||
      (currentPointerRef.current !== null && targetIntensityRef.current > 0);

    if (shouldContinue) {
      frameRef.current = requestAnimationFrame(animateDock);
      return;
    }

    currentPointerRef.current = null;
    stopAnimationFrame();
  };

  const ensureAnimationFrame = () => {
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(animateDock);
    }
  };

  useEffect(() => {
    return () => {
      stopAnimationFrame();
    };
  }, []);

  return (
    <aside
      className="liquid-sidebar hidden lg:flex w-22.5 shrink-0 flex-col items-center py-5"
      onMouseLeave={() => {
        targetPointerRef.current = null;
        targetIntensityRef.current = 0;
        ensureAnimationFrame();
      }}
    >
      <div className="liquid-glass-card">
        <div className="liquid-dock-slot mb-5">
          <img
            src="/orbital-logo.png"
            alt="Orbital Logo"
            className="h-13 w-13"
          />
        </div>

        <div
          ref={dockRef}
          className="liquid-sidebar-dock"
          onPointerEnter={(event) => {
            targetPointerRef.current = { x: event.clientX, y: event.clientY };
            targetIntensityRef.current = 1;
            ensureAnimationFrame();
          }}
          onPointerMove={(event) => {
            targetPointerRef.current = { x: event.clientX, y: event.clientY };
            targetIntensityRef.current = 1;
            ensureAnimationFrame();
          }}
          onPointerLeave={() => {
            targetPointerRef.current = null;
            targetIntensityRef.current = 0;
            ensureAnimationFrame();
          }}
        >
          {dockItems.map((item, index) => {
            const Icon = item.icon;
            const active = activeSection === item.key;

            return (
              <div key={item.key} className="liquid-dock-slot">
                <button
                  type="button"
                  title={item.label}
                  onClick={() => {
                    if (item.key === "inicio") onSelectSection("inicio");
                    if (item.key === "agendamentos")
                      onSelectSection("agendamentos");
                    if (item.key === "clientes") onSelectSection("clientes");
                    if (item.key === "servicos") onSelectSection("servicos");
                  }}
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  className={`liquid-dock-button ${active ? "is-active" : ""}`}
                  style={{ transform: "translate3d(0, 0px, 0) scale(1)" }}
                >
                  <Icon size={17} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <svg className="liquid-filter-svg" aria-hidden="true" focusable="false">
        <filter id="liquidDisplacementFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="200"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </aside>
  );
};

export default DashboardSidebar;
