
import { User } from "@/types";

export interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}

export interface PasswordUpdateResult {
  success: boolean;
  message?: string;
}
