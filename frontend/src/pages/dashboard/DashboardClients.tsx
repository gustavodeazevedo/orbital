// Tela de clientes com lista, busca e formulario.
// Usa dados do dashboard.
/*
 * Mostra os clientes e permite editar ou criar novos.
 * Centraliza a experiencia da area de clientes.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { dashboardDataService } from "../../services/dashboard/dashboardDataService";
import { DashboardClient } from "../../services/dashboard/dashboardModels";
import DashboardActionModal from "../../components/dashboard/DashboardActionModal";
import DashboardInfoModal from "../../components/dashboard/DashboardInfoModal";
import { useToast } from "../../components/ui/ToastProvider";

const DashboardClients = () => {
  const [clients, setClients] = useState<DashboardClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DashboardClient | null>(
    null,
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTarget, setDetailsTarget] = useState<DashboardClient | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [form, setForm] = useState({ nome: "", telefone: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const toast = useToast();

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await dashboardDataService.getClients();
      setClients(response);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os clientes.",
      );
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  const openCreateModal = () => {
    setEditingClientId(null);
    setForm({ nome: "", telefone: "", email: "" });
    setCreateErrorMessage("");
    setShowCreateModal(true);
  };

  const openEditModal = (client: DashboardClient) => {
    setEditingClientId(client.id);
    setForm({
      nome: client.nome,
      telefone: client.telefone ?? "",
      email: client.email ?? "",
    });
    setCreateErrorMessage("");
    setShowCreateModal(true);
  };

  const openDeleteModal = (client: DashboardClient) => {
    setDeleteTarget(client);
    setDeleteErrorMessage("");
    setShowDeleteModal(true);
  };

  const openDetailsModal = (client: DashboardClient) => {
    setDetailsTarget(client);
    setShowDetailsModal(true);
  };

  const handleCreateClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nome.trim()) {
      setCreateErrorMessage("Informe o nome do cliente.");
      return;
    }

    const trimmedEmail = form.email.trim();
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setCreateErrorMessage("Informe um e-mail válido.");
      return;
    }

    try {
      setIsCreating(true);
      setCreateErrorMessage("");

      const payload = {
        nome: form.nome.trim(),
        telefone: form.telefone.trim() || undefined,
        email: trimmedEmail || undefined,
      };

      if (editingClientId !== null) {
        await dashboardDataService.updateClient(editingClientId, payload);
        toast.success("Cliente atualizado com sucesso.");
      } else {
        await dashboardDataService.createClient(payload);
        toast.success("Cliente criado com sucesso.");
      }

      setShowCreateModal(false);
      setEditingClientId(null);
      setForm({ nome: "", telefone: "", email: "" });
      await loadClients();
    } catch (error) {
      setCreateErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o cliente.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteErrorMessage("");

      await dashboardDataService.deleteClient(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      toast.success("Cliente excluído com sucesso.");
      await loadClients();
    } catch (error) {
      setDeleteErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o cliente.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return clients;
    }

    return clients.filter((client) => {
      const haystack = [client.nome, client.telefone ?? "", client.email ?? ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [clients, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-5">
      {errorMessage && (
        <div className="rounded-xl border border-[#FFD7D7] bg-[#FFF1F1] px-4 py-3 text-sm text-[#7A1C1C]">
          {errorMessage}
        </div>
      )}

      <section className="bg-surface border border-border rounded-card shadow-sm p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted mb-2">
            Base de Clientes
          </p>
          <p className="text-3xl font-semibold text-text">
            {isLoading ? "..." : `${clients.length} ativos`}
          </p>
          <p className="text-sm text-text-secondary inline-flex items-center gap-1 mt-1">
            <Users size={14} /> relacionamento centralizado
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="h-10 px-4 rounded-button bg-primary text-text text-sm font-medium border-none inline-flex items-center gap-1.5 cursor-pointer hover:bg-primary-hover transition-colors"
        >
          <Plus size={14} /> Novo cliente
        </button>
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
              placeholder="Buscar por nome, telefone ou e-mail"
              className="h-10 w-full rounded-input border border-border bg-transparent pl-9 pr-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-text-muted">
            {filteredClients.length} resultado(s)
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-170">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-text-muted border-b border-divider">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Telefone</th>
                <th className="px-5 py-3 font-medium">E-mail</th>
                <th className="px-5 py-3 font-medium">Atendimentos</th>
                <th className="px-5 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && filteredClients.length === 0 ? (
                <tr className="border-b border-divider text-sm text-text-secondary">
                  <td className="px-5 py-6" colSpan={5}>
                    {searchTerm
                      ? "Nenhum cliente encontrado com esse filtro."
                      : "Nenhum cliente cadastrado até o momento."}
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-divider text-sm text-text"
                  >
                    <td className="px-5 py-3 font-medium">{client.nome}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      {client.telefone ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-text-secondary">
                      {client.email ?? "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-background-secondary text-text">
                        {client.totalAtendimentos} registros
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openDetailsModal(client)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text"
                        >
                          <Eye size={13} /> Detalhes
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(client)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text"
                        >
                          <Pencil size={13} /> Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(client)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#9A2C2C] hover:text-[#7A1C1C]"
                        >
                          <Trash2 size={13} /> Excluir
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
            Exibindo {paginatedClients.length} de {filteredClients.length}
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
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((previous) => Math.min(totalPages, previous + 1))
              }
              disabled={page >= totalPages}
              className="inline-flex h-9 items-center gap-1 rounded-button border border-border px-3 text-xs text-text-secondary hover:bg-background-secondary disabled:opacity-50"
            >
              Próxima <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
      <DashboardActionModal
        open={showCreateModal}
        title={editingClientId === null ? "Novo cliente" : "Editar cliente"}
        submitLabel={
          editingClientId === null ? "Criar cliente" : "Salvar alterações"
        }
        isSubmitting={isCreating}
        errorMessage={createErrorMessage}
        onClose={() => {
          if (isCreating) return;
          setShowCreateModal(false);
          setEditingClientId(null);
        }}
        onSubmit={handleCreateClient}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="client-name"
              className="text-sm text-text-secondary"
            >
              Nome
            </label>
            <input
              id="client-name"
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
              htmlFor="client-phone"
              className="text-sm text-text-secondary"
            >
              Telefone
            </label>
            <input
              id="client-phone"
              type="text"
              value={form.telefone}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  telefone: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="client-email"
              className="text-sm text-text-secondary"
            >
              E-mail
            </label>
            <input
              id="client-email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  email: event.target.value,
                }))
              }
              className="w-full h-11 rounded-input border border-border bg-transparent px-3 text-sm text-text outline-none focus:border-primary"
            />
          </div>
        </div>
      </DashboardActionModal>
      <DashboardActionModal
        open={showDeleteModal}
        title="Excluir cliente"
        submitLabel="Excluir cliente"
        isSubmitting={isDeleting}
        errorMessage={deleteErrorMessage}
        onClose={() => {
          if (isDeleting) return;
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        onSubmit={handleDeleteClient}
      >
        <p className="text-sm text-text-secondary">
          Tem certeza que deseja excluir o cliente{" "}
          <span className="font-semibold text-text">{deleteTarget?.nome}</span>?
          Essa ação remove o cliente e seus registros associados.
        </p>
      </DashboardActionModal>
      <DashboardInfoModal
        open={showDetailsModal}
        title="Detalhes do cliente"
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsTarget(null);
        }}
      >
        <div className="space-y-3 text-sm text-text-secondary">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Nome
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.nome}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              Telefone
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.telefone ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">
              E-mail
            </p>
            <p className="text-sm font-medium text-text">
              {detailsTarget?.email ?? "-"}
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

export default DashboardClients;
