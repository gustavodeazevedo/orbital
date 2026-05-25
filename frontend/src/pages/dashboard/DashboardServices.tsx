import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { FormEvent } from "react";
import { dashboardDataService } from "../../services/dashboard/dashboardDataService";
import { DashboardServiceItem } from "../../services/dashboard/dashboardModels";
import DashboardActionModal from "../../components/dashboard/DashboardActionModal";
import DashboardInfoModal from "../../components/dashboard/DashboardInfoModal";
import { useToast } from "../../components/ui/ToastProvider";

const formatCurrency = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

const DashboardServices = () => {
  const [services, setServices] = useState<DashboardServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DashboardServiceItem | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTarget, setDetailsTarget] =
    useState<DashboardServiceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const toast = useToast();
  const [form, setForm] = useState({
    nome: "",
    duracaoMinutos: "",
    preco: "",
  });

  const loadServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await dashboardDataService.getServices();
      setServices(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os serviços.",
      );
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const openCreateModal = () => {
    setEditingServiceId(null);
    setForm({ nome: "", duracaoMinutos: "", preco: "" });
    setCreateErrorMessage("");
    setShowCreateModal(true);
  };

  const openEditModal = (service: DashboardServiceItem) => {
    setEditingServiceId(service.id);
    setForm({
      nome: service.nome,
      duracaoMinutos: String(service.duracaoMinutos),
      preco: service.preco === null ? "" : String(service.preco),
    });
    setCreateErrorMessage("");
    setShowCreateModal(true);
  };

  const openDeleteModal = (service: DashboardServiceItem) => {
    setDeleteTarget(service);
    setDeleteErrorMessage("");
    setShowDeleteModal(true);
  };

  const openDetailsModal = (service: DashboardServiceItem) => {
    setDetailsTarget(service);
    setShowDetailsModal(true);
  };

  const handleCreateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nome.trim()) {
      setCreateErrorMessage("Informe o nome do serviço.");
      return;
    }

    const duration = Number(form.duracaoMinutos);
    if (!Number.isFinite(duration) || duration <= 0) {
      setCreateErrorMessage("Duração deve ser maior que zero.");
      return;
    }

    const parsedPrice = form.preco.trim() ? Number(form.preco) : undefined;
    if (
      parsedPrice !== undefined &&
      (!Number.isFinite(parsedPrice) || parsedPrice < 0)
    ) {
      setCreateErrorMessage("Preço deve ser maior ou igual a zero.");
      return;
    }

    try {
      setIsCreating(true);
      setCreateErrorMessage("");

      const payload = {
        nome: form.nome.trim(),
        duracaoMinutos: Math.round(duration),
        preco: parsedPrice,
      };

      if (editingServiceId !== null) {
        await dashboardDataService.updateService(editingServiceId, payload);
        toast.success("Serviço atualizado com sucesso.");
      } else {
        await dashboardDataService.createService(payload);
        toast.success("Serviço criado com sucesso.");
      }
      setShowCreateModal(false);
      setEditingServiceId(null);
      setForm({ nome: "", duracaoMinutos: "", preco: "" });
      await loadServices();
    } catch (error) {
      setCreateErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o serviço.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteErrorMessage("");

      await dashboardDataService.deleteService(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast.success("Serviço excluído com sucesso.");
      await loadServices();
    } catch (error) {
      setDeleteErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o serviço.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return services;
    }

    return services.filter((service) =>
      `${service.nome}`.toLowerCase().includes(term),
    );
  }, [services, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const averageTicket = useMemo(() => {
    const prices = services
      .map((service) => service.preco)
      .filter((price): price is number => price !== null);

    if (prices.length === 0) {
      return "-";
    }

    const total = prices.reduce((acc, item) => acc + item, 0);
    return formatCurrency(total / prices.length);
  }, [services]);

  const maxAppointments = useMemo(
    () =>
      services.reduce(
        (currentMax, service) =>
          Math.max(currentMax, service.totalAtendimentos),
        0,
      ),
    [services],
  );

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
            Catálogo
          </p>
          <p className="text-3xl font-semibold text-text">
            {isLoading ? "..." : `${services.length} serviços`}
          </p>
          <p className="text-sm text-text-secondary mt-1">
            ativos no portfólio
          </p>
        </article>

        <article className="bg-surface border border-border rounded-[18px] p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
              Ticket Médio
            </p>
            <p className="text-3xl font-semibold text-text">
              {isLoading ? "..." : averageTicket}
            </p>
          </div>
        </article>
        <article className="bg-surface border border-border rounded-[18px] p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
              Ação rápida
            </p>
            <p className="text-sm text-text-secondary">
              Crie um novo serviço para o catálogo.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="h-10 px-4 rounded-button bg-primary text-text text-sm font-medium border-none inline-flex items-center gap-1.5 cursor-pointer hover:bg-primary-hover transition-colors"
          >
            <Plus size={14} /> Novo serviço
          </button>
        </article>
      </section>

      <section className="bg-surface border border-border rounded-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-divider px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar servicos pelo nome"
              className="h-10 w-full rounded-input border border-border bg-transparent pl-9 pr-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-text-muted">
            {filteredServices.length} resultado(s)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-5 py-4">
          {!isLoading && filteredServices.length === 0 ? (
            <article className="bg-background-secondary border border-divider rounded-card p-5 text-sm text-text-secondary">
              {searchTerm
                ? "Nenhum servico encontrado com esse filtro."
                : "Nenhum servico cadastrado ate o momento."}
            </article>
          ) : (
            paginatedServices.map((service) => {
              const demand = service.demandLevel(maxAppointments);

              return (
                <article
                  key={service.id}
                  className="bg-surface border border-border rounded-card p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-text">
                        {service.nome}
                      </h3>
                      <p className="text-xs text-text-muted">
                        {service.totalAtendimentos} atendimento(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openDetailsModal(service)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text"
                      >
                        <Eye size={13} /> Detalhes
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(service)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text"
                      >
                        <Pencil size={13} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(service)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#9A2C2C] hover:text-[#7A1C1C]"
                      >
                        <Trash2 size={13} /> Excluir
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={14} /> {service.duracaoMinutos} min
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BadgeDollarSign size={14} />{" "}
                      {formatCurrency(service.preco)}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      demand === "alta"
                        ? "bg-[#EAF6EC] text-[#2F7A3E]"
                        : demand === "media"
                          ? "bg-[#FFF4DF] text-[#B16A00]"
                          : "bg-[#F1F2F4] text-[#535862]"
                    }`}
                  >
                    demanda {demand}
                  </span>
                </article>
              );
            })
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-divider px-5 py-4 text-sm text-text-secondary">
          <span>
            Exibindo {paginatedServices.length} de {filteredServices.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
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
      </section>
      <DashboardActionModal
        open={showCreateModal}
        title={editingServiceId === null ? "Novo serviço" : "Editar serviço"}
        submitLabel={
          editingServiceId === null ? "Criar serviço" : "Salvar alterações"
        }
        isSubmitting={isCreating}
        errorMessage={createErrorMessage}
        onClose={() => {
          if (isCreating) return;
          setShowCreateModal(false);
          setEditingServiceId(null);
        }}
        onSubmit={handleCreateService}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="service-name"
              className="text-sm text-text-secondary"
            >
              Nome
            </label>
            <input
              id="service-name"
              type="text"
              required
              value={form.nome}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  nome: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="service-duration"
              className="text-sm text-text-secondary"
            >
              Duração (min)
            </label>
            <input
              id="service-duration"
              type="number"
              min={1}
              required
              value={form.duracaoMinutos}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  duracaoMinutos: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="service-price"
              className="text-sm text-text-secondary"
            >
              Preço (R$)
            </label>
            <input
              id="service-price"
              type="number"
              min={0}
              step="0.01"
              value={form.preco}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  preco: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>
        </div>
      </DashboardActionModal>
      <DashboardActionModal
        open={showDeleteModal}
        title="Excluir serviço"
        submitLabel="Excluir serviço"
        isSubmitting={isDeleting}
        errorMessage={deleteErrorMessage}
        onClose={() => {
          if (isDeleting) return;
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onSubmit={handleDeleteService}
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que deseja excluir o serviço{" "}
          <span className="font-semibold text-text">{deleteTarget?.nome}</span>?
          Essa ação remove o serviço do catálogo.
        </p>
      </DashboardActionModal>
      <DashboardInfoModal
        open={showDetailsModal}
        title="Detalhes do servico"
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsTarget(null);
        }}
      >
        <div className="space-y-3 text-sm text-text-secondary">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Servico
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.nome}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Duracao
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.duracaoMinutos ?? 0} min
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Preco
            </p>
            <p className="text-sm font-medium text-text">
              {formatCurrency(detailsTarget?.preco ?? null)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Atendimentos
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.totalAtendimentos ?? 0} registro(s)
            </p>
          </div>
        </div>
      </DashboardInfoModal>
    </div>
  );
};

export default DashboardServices;
