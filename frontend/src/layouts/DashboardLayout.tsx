// Estrutura do dashboard com menu, topo e conteudo.
// Mostra as telas protegidas.
/*
 * Reune elementos fixos do dashboard, como menu e header.
 * Evita repetir layout em cada pagina interna.
 */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, LayoutGrid, Settings, Users } from "lucide-react";
import { authService } from "../services/auth/authService";
import { OperatorModel } from "../services/auth/authModels";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import IntroVideoModal from "../components/dashboard/IntroVideoModal";
import BottomDock from "../components/layout/BottomDock";

type DashboardSection = "inicio" | "agendamentos" | "clientes" | "servicos";

const sectionFromPath = (pathname: string): DashboardSection => {
  if (pathname.startsWith("/dashboard/agendamentos")) return "agendamentos";
  if (pathname.startsWith("/dashboard/clientes")) return "clientes";
  if (pathname.startsWith("/dashboard/servicos")) return "servicos";
  return "inicio";
};

const sectionLabel: Record<DashboardSection, string> = {
  inicio: "Painel Operacional",
  agendamentos: "Agendamentos",
  clientes: "Clientes",
  servicos: "Serviços",
};

class DashboardNavigationService {
  private readonly navigate: (path: string) => void;

  constructor(navigate: (path: string) => void) {
    this.navigate = navigate;
  }

  public goToSection(section: DashboardSection): void {
    if (section === "inicio") this.navigate("/dashboard");
    if (section === "agendamentos") this.navigate("/dashboard/agendamentos");
    if (section === "clientes") this.navigate("/dashboard/clientes");
    if (section === "servicos") this.navigate("/dashboard/servicos");
  }
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [operator, setOperator] = useState<OperatorModel | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const v = sessionStorage.getItem("orbital.intro.show");
      // remove the flag so refresh won't show again
      if (v) sessionStorage.removeItem("orbital.intro.show");
      return v === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (mounted) {
          setOperator(profile);
        }
      } catch {
        if (mounted) {
          setOperator(null);
        }
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const activeSection = sectionFromPath(location.pathname);

  const navigationService = useMemo(
    () => new DashboardNavigationService((path) => navigate(path)),
    [navigate],
  );

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const bottomDockItems = useMemo(
    () => [
      { key: "inicio", label: "Início", icon: LayoutGrid, to: "/dashboard" },
      {
        key: "agendamentos",
        label: "Agendamentos",
        icon: CalendarDays,
        to: "/dashboard/agendamentos",
      },
      {
        key: "clientes",
        label: "Clientes",
        icon: Users,
        to: "/dashboard/clientes",
      },
      {
        key: "servicos",
        label: "Serviços",
        icon: Settings,
        to: "/dashboard/servicos",
      },
    ],
    [],
  );

  return (
    <div className="h-screen w-screen bg-background-secondary overflow-hidden flex flex-col">
      <IntroVideoModal open={showIntro} onClose={() => setShowIntro(false)} />

      <div className="flex-1 w-full bg-surface overflow-hidden flex flex-col lg:flex-row">
        <DashboardSidebar
          activeSection={activeSection}
          onSelectSection={(section) => navigationService.goToSection(section)}
        />

        <main className="liquid-main-shell flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          <DashboardHeader
            activeSectionLabel={sectionLabel[activeSection]}
            operatorName={operator?.nome}
            onLogout={handleLogout}
          />

          <Outlet />
        </main>
      </div>

      <div className="lg:hidden">
        <BottomDock
          items={bottomDockItems}
          activeKey={activeSection}
          reserveSpace={false}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
