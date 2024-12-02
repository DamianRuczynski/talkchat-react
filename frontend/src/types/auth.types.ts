import { Dispatch, SetStateAction } from "react";

export type User = {
  _id: string;
  name: string;
  email: string;
  token: string;
};

export type RegisterInfo = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = User | { error: string };

export type AuthContextType = {
  user: User | null;
  authError: string | null;
  isAuthLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  registerUser: (info: RegisterInfo) => Promise<User | null>;
  loginUser: (info: LoginInfo) => Promise<User | null>;
  logoutUser: () => void;
};

export interface LoginInfo {
  email: string;
  password: string;
}

export type AuthResponse = User | { error: string };
