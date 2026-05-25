export interface RegisterPayload {
  nome: string;
  email: string;
  telefone?: string;
  nomeNegocio?: string;
  senha: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  novaSenha: string;
}

export class OperatorModel {
  public readonly id: number;
  public readonly nome: string;
  public readonly email: string;
  public readonly telefone: string | null;
  public readonly nomeNegocio: string | null;

  constructor(
    id: number,
    nome: string,
    email: string,
    telefone: string | null,
    nomeNegocio: string | null,
  ) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.nomeNegocio = nomeNegocio;
  }
}

export class LoginResult {
  public readonly accessToken: string;
  public readonly refreshToken: string;
  public readonly operator: OperatorModel;

  constructor(
    accessToken: string,
    refreshToken: string,
    operator: OperatorModel,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.operator = operator;
  }
}
