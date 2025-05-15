
import { z } from "zod";

export const anggotaLoginSchema = z.object({
  anggotaId: z.string().min(1, {
    message: "ID Anggota harus diisi"
  }),
  password: z.string().min(6, {
    message: "Kata sandi minimal 6 karakter"
  })
});
