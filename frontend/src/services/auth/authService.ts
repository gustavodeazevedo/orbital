import { ApiClientError, apiClient } from "../api/apiClient";
import { LoginResult, OperatorModel } from "./authModels";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "./authModels";

interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  operator: {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    nomeNegocio: string | null;
  };
}

interface OperatorResponseDto {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  nomeNegocio: string | null;
}

interface MessageResponseDto {
  message: string;
}

class AuthService {
  private readonly accessTokenStorageKey = "orbital.auth.access-token";
  private readonly refreshTokenStorageKey = "orbital.auth.refresh-token";

  async register(payload: RegisterPayload): Promise<OperatorModel> {
    const data = await apiClient.request<OperatorResponseDto>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
    return this.toOperatorModel(data);
  }

  async login(payload: LoginPayload): Promise<LoginResult> {
    const data = await apiClient.request<LoginResponseDto>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    this.setTokens(data.accessToken, data.refreshToken);
    return new LoginResult(
      data.accessToken,
      data.refreshToken,
      this.toOperatorModel(data.operator),
    );
  }

  async forgotPassword(payload: ForgotPasswordPayload): Promise<string> {
    const data = await apiClient.request<MessageResponseDto>(
      "/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return data.message;
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<string> {
    const data = await apiClient.request<MessageResponseDto>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return data.message;
  }

  async getProfile(): Promise<OperatorModel> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error("Sessão não encontrada");
    }

    try {
      const data = await apiClient.request<OperatorResponseDto>(
        "/operators/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return this.toOperatorModel(data);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        await this.refreshSession();
        const renewedAccessToken = this.getAccessToken();
        if (!renewedAccessToken) {
          throw new Error("Sessão expirada");
        }

        const retriedData = await apiClient.request<OperatorResponseDto>(
          "/operators/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${renewedAccessToken}`,
            },
          },
        );

        return this.toOperatorModel(retriedData);
      }

      throw error;
    }
  }

  async refreshSession(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      throw new Error("Sessão expirada");
    }

    const data = await apiClient.request<LoginResponseDto>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    this.setTokens(data.accessToken, data.refreshToken);
  }

  async validateSession(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenStorageKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenStorageKey);
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await apiClient.request<{ message: string }>("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // A sessão local deve ser encerrada mesmo com falha no backend.
      }
    }

    this.clearTokens();
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenStorageKey, accessToken);
    localStorage.setItem(this.refreshTokenStorageKey, refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.accessTokenStorageKey);
    localStorage.removeItem(this.refreshTokenStorageKey);
  }

  private toOperatorModel(data: OperatorResponseDto): OperatorModel {
    return new OperatorModel(
      data.id,
      data.nome,
      data.email,
      data.telefone,
      data.nomeNegocio,
    );
  }
}

export const authService = new AuthService();
