
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { KategoriTransaksi } from '@/types';
import { createKategoriTransaksi, updateKategoriTransaksi } from '@/services/keuanganService';

// Define form schema
const formSchema = z.object({
  nama: z.string().min(3, { message: 'Nama kategori minimal 3 karakter' }),
  deskripsi: z.string().optional(),
  jenis: z.enum(['Pemasukan', 'Pengeluaran']),
});

type FormValues = z.infer<typeof formSchema>;

interface KategoriFormProps {
  initialData?: KategoriTransaksi;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function KategoriForm({ initialData, onSuccess, onCancel }: KategoriFormProps) {
  const isEdit = !!initialData;
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: initialData?.nama || '',
      deskripsi: initialData?.deskripsi || '',
      jenis: initialData?.jenis || 'Pemasukan',
    }
  });
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    try {
      if (isEdit && initialData) {
        updateKategoriTransaksi(initialData.id, values);
        toast.success('Kategori berhasil diperbarui');
      } else {
        createKategoriTransaksi(values);
        toast.success('Kategori berhasil ditambahkan');
      }
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Gagal menyimpan kategori');
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="jenis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Transaksi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis transaksi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                      <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Name Field */}
            <FormField
              control={form.control}
              name="nama"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kategori</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description Field */}
            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Batal
                </Button>
              )}
              <Button type="submit">
                {isEdit ? 'Update' : 'Simpan'} Kategori
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
