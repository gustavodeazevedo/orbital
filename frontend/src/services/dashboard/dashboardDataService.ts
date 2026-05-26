// Busca e envia dados do dashboard no backend.
// Usa apiClient e authService para enviar a sessao.
/*
 * Concentra as chamadas de clientes, servicos e agendamentos.
 * Assim cada pagina usa a mesma forma de buscar dados.
 */
import { apiClient } from "../api/apiClient";
import { authService } from "../auth/authService";
import {
  DashboardAppointment,
  DashboardClient,
  DashboardServiceItem,
} from "./dashboardModels";

export interface CreateClientPayload {
  nome: string;
  telefone?: string;
  email?: string;
}

export interface UpdateClientPayload {
  nome: string;
  telefone?: string;
  email?: string;
}

export interface CreateServicePayload {
  nome: string;
  duracaoMinutos: number;
  preco?: number;
}

export interface UpdateServicePayload {
  nome: string;
  duracaoMinutos: number;
  preco?: number;
}

export interface CreateAppointmentPayload {
  clientId: number;
  serviceId: number;
  scheduledAt: string;
  status: string;
}

export interface UpdateAppointmentPayload {
  clientId: number;
  serviceId: number;
  scheduledAt: string;
  status: string;
}

interface ClientDto {
  id: number;
  nome: string;
  telefone: string | null;
  email: string | null;
  totalAtendimentos: number;
  criadoEm: string | null;
}

interface ServiceDto {
  id: number;
  nome: string;
  duracaoMinutos: number;
  preco: number | null;
  totalAtendimentos: number;
}

interface AppointmentDto {
  id: number;
  clientId: number;
  clientName: string;
  serviceId: number;
  serviceName: string;
  serviceDurationMinutes: number;
  servicePrice: number | null;
  scheduledAt: string;
  status: string;
}

class DashboardDataService {
  public async getClients(): Promise<DashboardClient[]> {
    const data = await apiClient.request<ClientDto[]>("/clients", {
      method: "GET",
      headers: this.createAuthHeaders(),
    });

    return data.map(
      (item) =>
        new DashboardClient(
          item.id,
          item.nome,
          item.telefone,
          item.email,
          item.totalAtendimentos,
          item.criadoEm ? new Date(item.criadoEm) : null,
        ),
    );
  }

  public async getServices(): Promise<DashboardServiceItem[]> {
    const data = await apiClient.request<ServiceDto[]>("/services", {
      method: "GET",
      headers: this.createAuthHeaders(),
    });

    return data.map(
      (item) =>
        new DashboardServiceItem(
          item.id,
          item.nome,
          item.duracaoMinutos,
          item.preco,
          item.totalAtendimentos,
        ),
    );
  }

  public async getAppointments(
    fromDate: string,
    toDate: string,
  ): Promise<DashboardAppointment[]> {
    const query = new URLSearchParams({
      from: fromDate,
      to: toDate,
    }).toString();

    const data = await apiClient.request<AppointmentDto[]>(
      `/appointments?${query}`,
      {
        method: "GET",
        headers: this.createAuthHeaders(),
      },
    );

    return data.map(
      (item) =>
        new DashboardAppointment(
          item.id,
          item.clientId,
          item.clientName,
          item.serviceId,
          item.serviceName,
          item.serviceDurationMinutes,
          item.servicePrice,
          new Date(item.scheduledAt),
          item.status,
        ),
    );
  }

  public async createClient(
    payload: CreateClientPayload,
  ): Promise<DashboardClient> {
    const data = await apiClient.request<ClientDto>("/clients", {
      method: "POST",
      headers: this.createAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return new DashboardClient(
      data.id,
      data.nome,
      data.telefone,
      data.email,
      data.totalAtendimentos,
      data.criadoEm ? new Date(data.criadoEm) : null,
    );
  }

  public async updateClient(
    clientId: number,
    payload: UpdateClientPayload,
  ): Promise<DashboardClient> {
    const data = await apiClient.request<ClientDto>(`/clients/${clientId}`, {
      method: "PUT",
      headers: this.createAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return new DashboardClient(
      data.id,
      data.nome,
      data.telefone,
      data.email,
      data.totalAtendimentos,
      data.criadoEm ? new Date(data.criadoEm) : null,
    );
  }

  public async deleteClient(clientId: number): Promise<void> {
    await apiClient.request<{ message: string }>(`/clients/${clientId}`, {
      method: "DELETE",
      headers: this.createAuthHeaders(),
    });
  }

  public async createService(
    payload: CreateServicePayload,
  ): Promise<DashboardServiceItem> {
    const data = await apiClient.request<ServiceDto>("/services", {
      method: "POST",
      headers: this.createAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return new DashboardServiceItem(
      data.id,
      data.nome,
      data.duracaoMinutos,
      data.preco,
      data.totalAtendimentos,
    );
  }

  public async updateService(
    serviceId: number,
    payload: UpdateServicePayload,
  ): Promise<DashboardServiceItem> {
    const data = await apiClient.request<ServiceDto>(`/services/${serviceId}`, {
      method: "PUT",
      headers: this.createAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return new DashboardServiceItem(
      data.id,
      data.nome,
      data.duracaoMinutos,
      data.preco,
      data.totalAtendimentos,
    );
  }

  public async deleteService(serviceId: number): Promise<void> {
    await apiClient.request<{ message: string }>(`/services/${serviceId}`, {
      method: "DELETE",
      headers: this.createAuthHeaders(),
    });
  }

  public async createAppointment(
    payload: CreateAppointmentPayload,
  ): Promise<DashboardAppointment> {
    const data = await apiClient.request<AppointmentDto>("/appointments", {
      method: "POST",
      headers: this.createAuthHeaders(),
      body: JSON.stringify(payload),
    });

    return new DashboardAppointment(
      data.id,
      data.clientId,
      data.clientName,
      data.serviceId,
      data.serviceName,
      data.serviceDurationMinutes,
      data.servicePrice,
      new Date(data.scheduledAt),
      data.status,
    );
  }

  public async updateAppointment(
    appointmentId: number,
    payload: UpdateAppointmentPayload,
  ): Promise<DashboardAppointment> {
    const data = await apiClient.request<AppointmentDto>(
      `/appointments/${appointmentId}`,
      {
        method: "PUT",
        headers: this.createAuthHeaders(),
        body: JSON.stringify(payload),
      },
    );

    return new DashboardAppointment(
      data.id,
      data.clientId,
      data.clientName,
      data.serviceId,
      data.serviceName,
      data.serviceDurationMinutes,
      data.servicePrice,
      new Date(data.scheduledAt),
      data.status,
    );
  }

  private createAuthHeaders(): Record<string, string> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new Error("Sessão não encontrada");
    }

    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }
}

export const dashboardDataService = new DashboardDataService();
