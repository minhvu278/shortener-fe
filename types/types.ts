// types.ts
export interface User {
  id: number;
  email: string;
  username: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  access_token: string;
  user: User;
}