
import * as z from 'zod';

// Define form schema for transaction form
export const transactionFormSchema = z.object({
  tanggal: z.date(),
  kategori: z.string().min(1, { message: 'Kategori harus dipilih' }),
  jumlah: z.coerce.number().positive({ message: 'Jumlah harus lebih dari 0' }),
  keterangan: z.string().min(3, { message: 'Keterangan minimal 3 karakter' }).max(200, { message: 'Keterangan maksimal 200 karakter' }),
  jenis: z.enum(['Pemasukan', 'Pengeluaran']),
  bukti: z.string().optional()
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
