
import * as z from "zod";

export const anggotaLoginSchema = z.object({
  anggotaId: z.string().min(1, "ID Anggota harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});
