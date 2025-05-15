
import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type FormValues = z.infer<typeof formSchema>;
