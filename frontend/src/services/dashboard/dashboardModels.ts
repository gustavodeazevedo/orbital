export class DashboardClient {
  public readonly id: number;
  public readonly nome: string;
  public readonly telefone: string | null;
  public readonly email: string | null;
  public readonly totalAtendimentos: number;
  public readonly criadoEm: Date | null;

  constructor(
    id: number,
    nome: string,
    telefone: string | null,
    email: string | null,
    totalAtendimentos: number,
    criadoEm: Date | null,
  ) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
    this.totalAtendimentos = totalAtendimentos;
    this.criadoEm = criadoEm;
  }

  public isNewBetween(start: Date, end: Date): boolean {
    if (!this.criadoEm) {
      return false;
    }
    return this.criadoEm >= start && this.criadoEm <= end;
  }

  public isRecurring(): boolean {
    return this.totalAtendimentos > 1;
  }
}

export class DashboardServiceItem {
  public readonly id: number;
  public readonly nome: string;
  public readonly duracaoMinutos: number;
  public readonly preco: number | null;
  public readonly totalAtendimentos: number;

  constructor(
    id: number,
    nome: string,
    duracaoMinutos: number,
    preco: number | null,
    totalAtendimentos: number,
  ) {
    this.id = id;
    this.nome = nome;
    this.duracaoMinutos = duracaoMinutos;
    this.preco = preco;
    this.totalAtendimentos = totalAtendimentos;
  }

  public demandLevel(maxAppointments: number): "alta" | "media" | "baixa" {
    if (maxAppointments <= 0) {
      return "baixa";
    }

    const ratio = this.totalAtendimentos / maxAppointments;
    if (ratio >= 0.67) {
      return "alta";
    }
    if (ratio >= 0.34) {
      return "media";
    }
    return "baixa";
  }
}

export class DashboardAppointment {
  public readonly id: number;
  public readonly clientId: number;
  public readonly clientName: string;
  public readonly serviceId: number;
  public readonly serviceName: string;
  public readonly serviceDurationMinutes: number;
  public readonly servicePrice: number | null;
  public readonly scheduledAt: Date;
  public readonly status: string;

  constructor(
    id: number,
    clientId: number,
    clientName: string,
    serviceId: number,
    serviceName: string,
    serviceDurationMinutes: number,
    servicePrice: number | null,
    scheduledAt: Date,
    status: string,
  ) {
    this.id = id;
    this.clientId = clientId;
    this.clientName = clientName;
    this.serviceId = serviceId;
    this.serviceName = serviceName;
    this.serviceDurationMinutes = serviceDurationMinutes;
    this.servicePrice = servicePrice;
    this.scheduledAt = scheduledAt;
    this.status = status;
  }

  public isCompleted(): boolean {
    const normalized = this.status.trim().toLowerCase();
    return normalized === "concluido" || normalized === "completed";
  }

  public isConfirmed(): boolean {
    const normalized = this.status.trim().toLowerCase();
    return (
      normalized === "confirmado" ||
      normalized === "confirmed" ||
      normalized === "concluido" ||
      normalized === "completed"
    );
  }

  public dateKey(): string {
    return this.scheduledAt.toISOString().slice(0, 10);
  }
}
