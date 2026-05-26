// Resumo do dashboard com indicadores.
// Busca dados e mostra os cards.
/*
 * Tela principal do dashboard, com os numeros gerais.
 * Faz o carregamento inicial das informacoes.
 */
import { useEffect, useMemo, useState } from "react";
import OrbitalOverviewCard from "../../components/dashboard/OrbitalOverviewCard";
import ActivityInsightsCard from "../../components/dashboard/ActivityInsightsCard";
import AppointmentsComparisonCard from "../../components/dashboard/AppointmentsComparisonCard";
import ClientsOverviewCard from "../../components/dashboard/ClientsOverviewCard";
import ServicesDistributionCard from "../../components/dashboard/ServicesDistributionCard";
import type { AIInsightItem } from "../../components/dashboard/OrbitalOverviewCard";
import { dashboardDataService } from "../../services/dashboard/dashboardDataService";
import {
  DashboardAppointment,
  DashboardClient,
  DashboardServiceItem,
} from "../../services/dashboard/dashboardModels";

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
});

const formatDateToQuery = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const lastSevenDays = (): Date[] => {
  const dates: Date[] = [];
  const base = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const current = new Date(base);
    current.setDate(base.getDate() - i);
    current.setHours(0, 0, 0, 0);
    dates.push(current);
  }

  return dates;
};

const toDayLabel = (date: Date): string => {
  const raw = DAY_LABEL_FORMATTER.format(date).replace(".", "");
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const DashboardHome = () => {
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [clients, setClients] = useState<DashboardClient[]>([]);
  const [services, setServices] = useState<DashboardServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const dates = lastSevenDays();
        const fromDate = formatDateToQuery(dates[0]);
        const toDate = formatDateToQuery(dates[dates.length - 1]);

        const [appointmentsResponse, clientsResponse, servicesResponse] =
          await Promise.all([
            dashboardDataService.getAppointments(fromDate, toDate),
            dashboardDataService.getClients(),
            dashboardDataService.getServices(),
          ]);

        if (!mounted) return;

        setAppointments(appointmentsResponse);
        setClients(clientsResponse);
        setServices(servicesResponse);
      } catch (error) {
        if (!mounted) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados do dashboard.",
        );
        setAppointments([]);
        setClients([]);
        setServices([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const weekDates = useMemo(() => lastSevenDays(), []);

  const dayMeta = useMemo(
    () =>
      weekDates.map((date) => ({
        key: formatDateToQuery(date),
        label: toDayLabel(date),
      })),
    [weekDates],
  );

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, DashboardAppointment[]>();
    dayMeta.forEach((day) => map.set(day.key, []));

    appointments.forEach((item) => {
      const key = item.dateKey();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(item);
    });

    return map;
  }, [appointments, dayMeta]);

  const confirmedCount = useMemo(
    () => appointments.filter((item) => item.isConfirmed()).length,
    [appointments],
  );

  const completedCount = useMemo(
    () => appointments.filter((item) => item.isCompleted()).length,
    [appointments],
  );

  const activityData = useMemo(
    () =>
      dayMeta.map((day) => ({
        day: day.label,
        value: (appointmentsByDay.get(day.key) ?? []).filter((item) =>
          item.isConfirmed(),
        ).length,
      })),
    [appointmentsByDay, dayMeta],
  );

  const comparisonData = useMemo(
    () =>
      dayMeta.map((day) => {
        const dayAppointments = appointmentsByDay.get(day.key) ?? [];
        return {
          day: day.label,
          agendados: dayAppointments.length,
          concluidos: dayAppointments.filter((item) => item.isCompleted())
            .length,
        };
      }),
    [appointmentsByDay, dayMeta],
  );

  const completionRate = useMemo(() => {
    if (appointments.length === 0) {
      return 0;
    }
    return Math.round((completedCount / appointments.length) * 100);
  }, [appointments.length, completedCount]);

  const clientsById = useMemo(() => {
    const map = new Map<number, DashboardClient>();
    clients.forEach((client) => {
      map.set(client.id, client);
    });
    return map;
  }, [clients]);

  const startDate = weekDates[0];
  const endDate = useMemo(() => {
    const end = new Date(weekDates[weekDates.length - 1]);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [weekDates]);

  const newClientsWeek = useMemo(
    () =>
      clients.filter((item) => item.isNewBetween(startDate, endDate)).length,
    [clients, endDate, startDate],
  );

  const recurringClients = useMemo(
    () => clients.filter((item) => item.isRecurring()).length,
    [clients],
  );

  const clientsOverviewData = useMemo(
    () =>
      dayMeta.map((day) => {
        const dayAppointments = appointmentsByDay.get(day.key) ?? [];
        const newClientsSet = new Set<number>();
        const recurringClientsSet = new Set<number>();

        dayAppointments.forEach((item) => {
          const relatedClient = clientsById.get(item.clientId);
          if (!relatedClient) return;

          if (relatedClient.isRecurring()) {
            recurringClientsSet.add(relatedClient.id);
            return;
          }

          newClientsSet.add(relatedClient.id);
        });

        return {
          day: day.label,
          novos: newClientsSet.size,
          recorrentes: recurringClientsSet.size,
        };
      }),
    [appointmentsByDay, clientsById, dayMeta],
  );

  const topServices = useMemo(() => {
    const totalServiceUsage = services.reduce(
      (acc, service) => acc + service.totalAtendimentos,
      0,
    );

    if (totalServiceUsage === 0) {
      return [];
    }

    return [...services]
      .sort((a, b) => b.totalAtendimentos - a.totalAtendimentos)
      .slice(0, 2)
      .map((service) => ({
        nome: service.nome,
        percentual: Math.round(
          (service.totalAtendimentos / totalServiceUsage) * 100,
        ),
      }));
  }, [services]);

  const orbitalInsights = useMemo<ReadonlyArray<AIInsightItem>>(() => {
    const insights: AIInsightItem[] = [];

    if (appointments.length > 0) {
      const peakDay = [...comparisonData].sort(
        (a, b) => b.agendados - a.agendados,
      )[0];
      if (peakDay && peakDay.agendados > 0) {
        const peakConfidence = Math.min(
          99,
          Math.max(
            60,
            Math.round(
              (peakDay.agendados / Math.max(appointments.length, 1)) * 100,
            ),
          ),
        );

        insights.push({
          id: "peak-day",
          title: "Dia com maior demanda",
          description: `${peakDay.day} concentrou ${peakDay.agendados} agendamento(s) no período analisado.`,
          impact: "alto",
          confidence: peakConfidence,
        });
      }

      if (completionRate < 70) {
        const completionConfidence = Math.min(
          95,
          60 + Math.round((100 - completionRate) * 0.45),
        );

        insights.push({
          id: "completion-rate",
          title: "Taxa de conclusão abaixo do ideal",
          description: `A taxa de conclusão atual está em ${completionRate}%. Vale revisar confirmações e lembretes automáticos.`,
          impact: "medio",
          confidence: completionConfidence,
        });
      }
    }

    if (recurringClients > 0) {
      const recurringConfidence = Math.min(95, 60 + recurringClients * 5);

      insights.push({
        id: "recurring-clients",
        title: "Base recorrente ativa",
        description: `${recurringClients} cliente(s) já retornaram mais de uma vez, sinalizando retenção real.`,
        impact: "baixo",
        confidence: recurringConfidence,
      });
    }

    return insights.slice(0, 3);
  }, [appointments.length, comparisonData, completionRate, recurringClients]);

  const recommendations = useMemo(() => {
    const items: string[] = [];

    if (completionRate < 70 && appointments.length > 0) {
      items.push(
        "Reforce confirmação automática para reduzir faltas e elevar a taxa de conclusão.",
      );
    }

    if (topServices.length > 0) {
      items.push(
        `Promova o serviço "${topServices[0].nome}" em horários ociosos para ampliar ocupação.`,
      );
    }

    if (newClientsWeek > 0) {
      items.push(
        "Ative campanhas de retorno para novos clientes convertidos nesta semana.",
      );
    }

    return items.slice(0, 3);
  }, [appointments.length, completionRate, newClientsWeek, topServices]);

  const lastUpdatedLabel = useMemo(() => {
    const now = new Date();
    return `Atualizado às ${now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }, []);

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-[#FFD7D7] bg-[#FFF1F1] px-4 py-3 text-sm text-[#7A1C1C]">
          {errorMessage}
        </div>
      )}

      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-5"
        style={{ gridTemplateRows: "auto auto" }}
      >
        <div className="lg:col-span-3 lg:row-span-2 min-h-0">
          <OrbitalOverviewCard
            insights={orbitalInsights}
            recommendations={recommendations}
            isLoading={isLoading}
            lastUpdatedLabel={lastUpdatedLabel}
          />
        </div>

        <div className="lg:col-span-4">
          <ActivityInsightsCard
            weeklyData={activityData}
            confirmedCount={confirmedCount}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-5">
          <AppointmentsComparisonCard
            weeklyData={comparisonData}
            totalAppointments={appointments.length}
            completionRate={completionRate}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-5">
          <ClientsOverviewCard
            weeklyData={clientsOverviewData}
            newClientsWeek={newClientsWeek}
            recurringClients={recurringClients}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-4">
          <ServicesDistributionCard
            totalServices={services.length}
            topServices={topServices}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
