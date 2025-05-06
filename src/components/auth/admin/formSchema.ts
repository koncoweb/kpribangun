
import { z } from "zod";

// Create schema for admin login form validation
export const adminLoginFormSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});
