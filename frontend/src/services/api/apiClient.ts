// Faz pedidos para o backend e trata erros.
// Usado pelos servicos de login e dashboard.
/*
 * Centraliza as chamadas para nao repetir codigo em cada tela.
 * Se a forma de falar com o backend mudar, ajusta aqui.
 */
export interface ApiErrorPayload {
  code: string;
  message: string;
  timestamp?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });

    const textPayload = await response.text();
    const payload = textPayload
      ? (JSON.parse(textPayload) as ApiResponse<T>)
      : ({ success: false, data: null, error: null } as ApiResponse<T>);

    if (!response.ok || !payload.success || payload.data === null) {
      throw new ApiClientError(
        payload.error?.message ?? "Erro inesperado na API",
        response.status,
        payload.error?.code ?? "API_ERROR",
      );
    }

    return payload.data;
  }
}

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.toString() ?? "http://localhost:8080";

export const apiClient = new ApiClient(apiBaseUrl);
