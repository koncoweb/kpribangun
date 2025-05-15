
import { z } from "zod";

export const formSchema = z.object({
  anggotaId: z.string().min(1, "ID Anggota wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type FormValues = z.infer<typeof formSchema>;
