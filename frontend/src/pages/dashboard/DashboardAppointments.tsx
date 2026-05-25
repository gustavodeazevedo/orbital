import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { FormEvent } from "react";
import {
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Pencil,
  Plus,
  Search,
  Timer,
  XCircle,
} from "lucide-react";
import { dashboardDataService } from "../../services/dashboard/dashboardDataService";
import {
  DashboardAppointment,
  DashboardClient,
  DashboardServiceItem,
} from "../../services/dashboard/dashboardModels";
import DashboardActionModal from "../../components/dashboard/DashboardActionModal";
import DashboardInfoModal from "../../components/dashboard/DashboardInfoModal";
import { useToast } from "../../components/ui/ToastProvider";

const formatDateToQuery = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatHour = (date: Date): string =>
  date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const defaultScheduledAt = (): string => {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setSeconds(0, 0);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatDateOnly = (date: Date): string => formatDateToQuery(date);

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
});

const startOfWeek = (date: Date): Date => {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
};

const buildWeek = (date: Date): Date[] => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    return current;
  });
};

const statusPillClass = (status: string): string => {
  const normalized = status.trim().toLowerCase();
  if (normalized === "confirmado" || normalized === "confirmed") {
    return "bg-[#EAF6EC] text-[#2F7A3E]";
  }
  if (normalized === "concluido" || normalized === "completed") {
    return "bg-[#E7EEF8] text-[#1E4D8C]";
  }
  if (normalized === "cancelado" || normalized === "canceled") {
    return "bg-[#F9E8E8] text-[#9A2C2C]";
  }
  return "bg-[#FFF4DF] text-[#B16A00]";
};

const DashboardAppointments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState<DashboardAppointment[]>([]);
  const [clients, setClients] = useState<DashboardClient[]>([]);
  const [services, setServices] = useState<DashboardServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [editingAppointment, setEditingAppointment] =
    useState<DashboardAppointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<DashboardAppointment | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTarget, setDetailsTarget] =
    useState<DashboardAppointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelErrorMessage, setCancelErrorMessage] = useState("");
  const [form, setForm] = useState({
    clientId: "",
    serviceId: "",
    scheduledAt: defaultScheduledAt(),
    status: "confirmado",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const toast = useToast();

  const getDateRange = useCallback(() => {
    if (viewMode === "week") {
      const week = buildWeek(selectedDate);
      return {
        from: formatDateOnly(week[0]),
        to: formatDateOnly(week[6]),
      };
    }

    return {
      from: formatDateOnly(selectedDate),
      to: formatDateOnly(selectedDate),
    };
  }, [selectedDate, viewMode]);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const { from, to } = getDateRange();
      const response = await dashboardDataService.getAppointments(from, to);
      setAppointments(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os agendamentos.",
      );
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [getDateRange]);

  const loadDependencies = useCallback(async () => {
    try {
      const [clientsResponse, servicesResponse] = await Promise.all([
        dashboardDataService.getClients(),
        dashboardDataService.getServices(),
      ]);

      setClients(clientsResponse);
      setServices(servicesResponse);
    } catch {
      setClients([]);
      setServices([]);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
    void loadDependencies();
  }, [loadAppointments, loadDependencies]);

  const openCreateModal = () => {
    setEditingAppointment(null);
    setForm({
      clientId: "",
      serviceId: "",
      scheduledAt: defaultScheduledAt(),
      status: "confirmado",
    });
    setCreateErrorMessage("");
    setShowCreateModal(true);
  };

  const openEditModal = (appointment: DashboardAppointment) => {
    setEditingAppointment(appointment);
    setForm({
      clientId: String(appointment.clientId),
      serviceId: String(appointment.serviceId),
      scheduledAt: formatDateForInput(appointment.scheduledAt),
      status: appointment.status,
    });
    setCreateErrorMessage("");
    setShowCreateModal(true);
  };

  const openCancelModal = (appointment: DashboardAppointment) => {
    setCancelTarget(appointment);
    setCancelErrorMessage("");
    setShowCancelModal(true);
  };

  const openDetailsModal = (appointment: DashboardAppointment) => {
    setDetailsTarget(appointment);
    setShowDetailsModal(true);
  };

  useEffect(() => {
    if (searchParams.get("new") !== "1") {
      return;
    }

    setCreateErrorMessage("");
    setShowCreateModal(true);

    const next = new URLSearchParams(searchParams);
    next.delete("new");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleCreateAppointment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (clients.length === 0) {
      setCreateErrorMessage("Cadastre ao menos um cliente antes de agendar.");
      return;
    }

    if (services.length === 0) {
      setCreateErrorMessage("Cadastre ao menos um serviço antes de agendar.");
      return;
    }

    const clientId = Number(form.clientId);
    const serviceId = Number(form.serviceId);

    if (!Number.isFinite(clientId) || !Number.isFinite(serviceId)) {
      setCreateErrorMessage("Selecione cliente e serviço válidos.");
      return;
    }

    const scheduledDate = new Date(form.scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      setCreateErrorMessage("Informe uma data e hora válidas.");
      return;
    }

    try {
      setIsCreating(true);
      setCreateErrorMessage("");

      const payload = {
        clientId,
        serviceId,
        scheduledAt: form.scheduledAt,
        status: form.status,
      };

      if (editingAppointment) {
        await dashboardDataService.updateAppointment(
          editingAppointment.id,
          payload,
        );
        toast.success("Agendamento atualizado com sucesso.");
      } else {
        await dashboardDataService.createAppointment(payload);
        toast.success("Agendamento criado com sucesso.");
      }

      setShowCreateModal(false);
      setEditingAppointment(null);
      setForm({
        clientId: "",
        serviceId: "",
        scheduledAt: defaultScheduledAt(),
        status: "confirmado",
      });
      await loadAppointments();
    } catch (error) {
      setCreateErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o agendamento.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelAppointment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!cancelTarget) {
      return;
    }

    try {
      setIsCancelling(true);
      setCancelErrorMessage("");

      await dashboardDataService.updateAppointment(cancelTarget.id, {
        clientId: cancelTarget.clientId,
        serviceId: cancelTarget.serviceId,
        scheduledAt: formatDateForInput(cancelTarget.scheduledAt),
        status: "cancelado",
      });

      setShowCancelModal(false);
      setCancelTarget(null);
      toast.success("Agendamento cancelado com sucesso.");
      await loadAppointments();
    } catch (error) {
      setCancelErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar o agendamento.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return appointments;
    }

    return appointments.filter((item) => {
      const haystack =
        `${item.clientName} ${item.serviceName} ${item.status}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [appointments, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / pageSize),
  );

  const paginatedAppointments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAppointments.slice(start, start + pageSize);
  }, [filteredAppointments, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, viewMode, selectedDate]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const weekDates = useMemo(
    () => (viewMode === "week" ? buildWeek(selectedDate) : []),
    [selectedDate, viewMode],
  );

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, DashboardAppointment[]>();
    weekDates.forEach((date) => map.set(formatDateOnly(date), []));

    filteredAppointments.forEach((item) => {
      const key = item.dateKey();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(item);
    });

    return map;
  }, [filteredAppointments, weekDates]);

  const rangeLabel = useMemo(() => {
    if (viewMode === "week" && weekDates.length > 0) {
      const start = weekDates[0];
      const end = weekDates[weekDates.length - 1];
      return `Semana de ${start.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })} ate ${end.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })}`;
    }

    return selectedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate, viewMode, weekDates]);

  const shiftDate = (direction: "prev" | "next") => {
    const delta = viewMode === "week" ? 7 : 1;
    setSelectedDate((previous) => {
      const next = new Date(previous);
      next.setDate(
        previous.getDate() + (direction === "prev" ? -delta : delta),
      );
      return next;
    });
  };

  const handleDateChange = (value: string) => {
    if (!value) {
      return;
    }

    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) {
      return;
    }

    const next = new Date(year, month - 1, day);
    next.setHours(0, 0, 0, 0);
    setSelectedDate(next);
  };

  const averageDuration = useMemo(() => {
    if (appointments.length === 0) {
      return "-";
    }

    const totalMinutes = appointments.reduce(
      (sum, item) => sum + item.serviceDurationMinutes,
      0,
    );

    return `${Math.round(totalMinutes / appointments.length)}m`;
  }, [appointments]);

  const nextAppointmentLabel = useMemo(() => {
    const now = new Date();
    const next = appointments.find((item) => item.scheduledAt >= now);

    if (!next) {
      return "--:--";
    }

    return formatHour(next.scheduledAt);
  }, [appointments]);

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div className="rounded-xl border border-[#FFD7D7] bg-[#FFF1F1] px-4 py-3 text-sm text-[#7A1C1C]">
          {errorMessage}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="bg-surface border border-border rounded-[18px] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
            {viewMode === "week" ? "Semana" : "Hoje"}
          </p>
          <p className="text-3xl font-semibold text-text mb-1">
            {isLoading ? "..." : appointments.length}
          </p>
          <p className="text-sm text-text-secondary inline-flex items-center gap-1">
            <CalendarClock size={14} /> agendamentos
          </p>
        </article>

        <article className="bg-surface border border-border rounded-[18px] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
            Tempo Médio
          </p>
          <p className="text-3xl font-semibold text-text mb-1">
            {isLoading ? "..." : averageDuration}
          </p>
          <p className="text-sm text-text-secondary inline-flex items-center gap-1">
            <Timer size={14} /> por atendimento
          </p>
        </article>

        <article className="bg-surface border border-border rounded-[18px] p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
            Próximo atendimento
          </p>
          <p className="text-3xl font-semibold text-text mb-1">
            {isLoading ? "..." : nextAppointmentLabel}
          </p>
          <p className="text-sm text-text-secondary inline-flex items-center gap-1">
            <Clock3 size={14} /> programado
          </p>
        </article>
      </section>

      <section className="bg-surface border border-border rounded-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-divider px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-text-muted">
                Agenda
              </p>
              <h3 className="text-lg font-semibold text-text">
                {viewMode === "week" ? "Agenda da Semana" : "Agenda do Dia"}
              </h3>
              <p className="text-xs text-text-muted mt-1">{rangeLabel}</p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="h-9 px-3 rounded-button bg-primary text-text text-sm font-medium border-none inline-flex items-center gap-1.5 cursor-pointer hover:bg-primary-hover transition-colors"
            >
              <Plus size={14} /> Novo agendamento
            </button>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-button border border-border bg-background-secondary p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("day")}
                  className={`h-8 px-3 rounded-button text-xs font-medium ${
                    viewMode === "day"
                      ? "bg-primary text-text"
                      : "text-text-secondary"
                  }`}
                >
                  Dia
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("week")}
                  className={`h-8 px-3 rounded-button text-xs font-medium ${
                    viewMode === "week"
                      ? "bg-primary text-text"
                      : "text-text-secondary"
                  }`}
                >
                  Semana
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => shiftDate("prev")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-button border border-border text-text-secondary hover:bg-background-secondary"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="relative">
                  <CalendarDays
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="date"
                    value={formatDateOnly(selectedDate)}
                    onChange={(event) => handleDateChange(event.target.value)}
                    className="h-8 rounded-button border border-border bg-transparent pl-8 pr-3 text-xs text-text outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => shiftDate("next")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-button border border-border text-text-secondary hover:bg-background-secondary"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por cliente, servico ou status"
                className="h-10 w-full rounded-input border border-border bg-transparent pl-9 pr-3 text-sm text-text outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {viewMode === "day" ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-170">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
                    <th className="px-5 py-3 font-medium">Horario</th>
                    <th className="px-5 py-3 font-medium">Cliente</th>
                    <th className="px-5 py-3 font-medium">Servico</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading && filteredAppointments.length === 0 ? (
                    <tr className="border-t border-divider text-sm text-text-secondary">
                      <td className="px-5 py-6" colSpan={5}>
                        {searchTerm
                          ? "Nenhum agendamento encontrado com esse filtro."
                          : "Nenhum agendamento encontrado para este dia."}
                      </td>
                    </tr>
                  ) : (
                    paginatedAppointments.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-divider text-sm text-text"
                      >
                        <td className="px-5 py-3 font-medium">
                          {formatHour(item.scheduledAt)}
                        </td>
                        <td className="px-5 py-3">{item.clientName}</td>
                        <td className="px-5 py-3">{item.serviceName}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => openDetailsModal(item)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text"
                            >
                              <Eye size={13} /> Detalhes
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text"
                            >
                              <Pencil size={13} /> Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => openCancelModal(item)}
                              disabled={
                                item.status.trim().toLowerCase() ===
                                  "cancelado" ||
                                item.status.trim().toLowerCase() === "canceled"
                              }
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#9A2C2C] hover:text-[#7A1C1C] disabled:opacity-50"
                            >
                              <XCircle size={13} /> Cancelar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-divider px-5 py-4 text-sm text-text-secondary">
              <span>
                Exibindo {paginatedAppointments.length} de{" "}
                {filteredAppointments.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={page <= 1}
                  className="inline-flex h-9 items-center gap-1 rounded-button border border-border px-3 text-xs text-text-secondary hover:bg-background-secondary disabled:opacity-50"
                >
                  <ChevronLeft size={14} /> Anterior
                </button>
                <span className="text-xs text-text-muted">
                  Pagina {page} de {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((previous) => Math.min(totalPages, previous + 1))
                  }
                  disabled={page >= totalPages}
                  className="inline-flex h-9 items-center gap-1 rounded-button border border-border px-3 text-xs text-text-secondary hover:bg-background-secondary disabled:opacity-50"
                >
                  Proxima <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-5 py-4 lg:grid-cols-7">
            {weekDates.map((date) => {
              const key = formatDateOnly(date);
              const dayLabel = DAY_LABEL_FORMATTER.format(date).replace(
                ".",
                "",
              );
              const dayItems = appointmentsByDate.get(key) ?? [];

              return (
                <article
                  key={key}
                  className="rounded-card border border-divider bg-background-secondary p-3"
                >
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="uppercase">{dayLabel}</span>
                    <span>{date.getDate().toString().padStart(2, "0")}</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {dayItems.length === 0 ? (
                      <p className="text-xs text-text-secondary">
                        Sem agendamentos.
                      </p>
                    ) : (
                      dayItems.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-input border border-border bg-surface px-2 py-2 text-xs text-text"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold">
                                {formatHour(item.scheduledAt)} ·{" "}
                                {item.clientName}
                              </p>
                              <p className="text-[11px] text-text-secondary">
                                {item.serviceName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openDetailsModal(item)}
                                className="text-text-secondary hover:text-text"
                                aria-label="Detalhes"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                className="text-text-secondary hover:text-text"
                                aria-label="Editar"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openCancelModal(item)}
                                disabled={
                                  item.status.trim().toLowerCase() ===
                                    "cancelado" ||
                                  item.status.trim().toLowerCase() ===
                                    "canceled"
                                }
                                className="text-[#9A2C2C] hover:text-[#7A1C1C] disabled:opacity-50"
                                aria-label="Cancelar"
                              >
                                <XCircle size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
      <DashboardActionModal
        open={showCreateModal}
        title={editingAppointment ? "Editar agendamento" : "Novo agendamento"}
        submitLabel={
          editingAppointment ? "Salvar alterações" : "Criar agendamento"
        }
        isSubmitting={isCreating}
        errorMessage={createErrorMessage}
        onClose={() => {
          if (isCreating) return;
          setShowCreateModal(false);
          setEditingAppointment(null);
        }}
        onSubmit={handleCreateAppointment}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="appointment-client"
              className="text-sm text-text-secondary"
            >
              Cliente
            </label>
            <select
              id="appointment-client"
              required
              value={form.clientId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  clientId: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            >
              <option value="">Selecione um cliente</option>
              {clients.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="appointment-service"
              className="text-sm text-text-secondary"
            >
              Serviço
            </label>
            <select
              id="appointment-service"
              required
              value={form.serviceId}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  serviceId: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            >
              <option value="">Selecione um serviço</option>
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="appointment-date"
              className="text-sm text-text-secondary"
            >
              Data e hora
            </label>
            <input
              id="appointment-date"
              type="datetime-local"
              required
              value={form.scheduledAt}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  scheduledAt: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="appointment-status"
              className="text-sm text-text-secondary"
            >
              Status
            </label>
            <select
              id="appointment-status"
              required
              value={form.status}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  status: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            >
              <option value="confirmado">Confirmado</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>
      </DashboardActionModal>
      <DashboardActionModal
        open={showCancelModal}
        title="Cancelar agendamento"
        submitLabel="Confirmar cancelamento"
        isSubmitting={isCancelling}
        errorMessage={cancelErrorMessage}
        onClose={() => {
          if (isCancelling) return;
          setShowCancelModal(false);
          setCancelTarget(null);
        }}
        onSubmit={handleCancelAppointment}
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que deseja cancelar o agendamento de{" "}
          <span className="font-semibold text-text">
            {cancelTarget?.clientName}
          </span>
          ?
        </p>
      </DashboardActionModal>
      <DashboardInfoModal
        open={showDetailsModal}
        title="Detalhes do agendamento"
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsTarget(null);
        }}
      >
        <div className="space-y-3 text-sm text-text-secondary">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Cliente
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.clientName}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Servico
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.serviceName}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Data e hora
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget
                ? detailsTarget.scheduledAt.toLocaleString("pt-BR")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Status
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.status}
            </p>
          </div>
        </div>
      </DashboardInfoModal>
    </div>
  );
};

export default DashboardAppointments;
