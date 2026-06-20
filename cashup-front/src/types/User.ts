// Dados do usuário que o backend retorna no /auth/me e /login
export interface User {
  id: number;
  name: string;
  email: string;
}

// Resposta do endpoint POST /api/auth/login
export interface LoginResponse {
  token: string;
  user: User;
}

// Resposta do endpoint GET /api/auth/me
export interface MeResponse {
  user: User;
}

// Dados necessários para efetuar o login (Formulário)
export interface SignInCredentials {
  email: string;
  password: string;
}

// Estrutura do que o AuthContext vai compartilhar com o resto do App
export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (credentials: object) => Promise<void>;
  signOut: () => void;
}