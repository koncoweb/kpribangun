
import { z } from "zod";

// Create schema for anggota login form validation
export const anggotaFormSchema = z.object({
  anggotaId: z.string().min(2, "ID Anggota minimal 2 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});
