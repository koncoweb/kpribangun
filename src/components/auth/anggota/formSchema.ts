
import { z } from "zod";

// Login form schema untuk anggota
export const anggotaLoginSchema = z.object({
  anggotaId: z
    .string()
    .min(1, "ID Anggota tidak boleh kosong"),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong"),
});
