
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { PemasukanPengeluaran, KategoriTransaksi } from '@/types';
import { getAllKategoriTransaksi, createPemasukanPengeluaran, updatePemasukanPengeluaran } from '@/services/keuanganService';
import { formatNumberInput, cleanNumberInput } from '@/utils/formatters';

// Define form schema
const formSchema = z.object({
  tanggal: z.date(),
  kategori: z.string().min(1, { message: 'Kategori harus dipilih' }),
  jumlah: z.coerce.number().positive({ message: 'Jumlah harus lebih dari 0' }),
  keterangan: z.string().min(3, { message: 'Keterangan minimal 3 karakter' }).max(200, { message: 'Keterangan maksimal 200 karakter' }),
  jenis: z.enum(['Pemasukan', 'Pengeluaran']),
  bukti: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface TransaksiFormProps {
  initialData?: PemasukanPengeluaran;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransaksiForm({ initialData, onSuccess, onCancel }: TransaksiFormProps) {
  const [categories, setCategories] = useState<KategoriTransaksi[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.bukti || null);
  const [formattedJumlah, setFormattedJumlah] = useState<string>("");
  const isEdit = !!initialData;
  
  // Initialize form with data if editing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tanggal: initialData ? new Date(initialData.tanggal) : new Date(),
      kategori: initialData?.kategori || '',
      jumlah: initialData?.jumlah || 0,
      keterangan: initialData?.keterangan || '',
      jenis: initialData?.jenis || 'Pemasukan',
      bukti: initialData?.bukti || ''
    }
  });

  // Update formatted amount when form values change
  useEffect(() => {
    const amount = form.watch('jumlah');
    if (amount) {
      setFormattedJumlah(formatNumberInput(amount));
    } else {
      setFormattedJumlah("");
    }
  }, [form.watch('jumlah')]);
  
  // Load categories on component mount
  useEffect(() => {
    const allCategories = getAllKategoriTransaksi();
    setCategories(allCategories);
  }, []);
  
  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(cat => 
    cat.jenis === form.watch('jenis')
  );
  
  // Handle amount input with formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove any non-numeric characters
    const numericValue = inputValue.replace(/[^\d]/g, '');
    
    if (!numericValue) {
      setFormattedJumlah("");
      form.setValue('jumlah', 0);
      return;
    }
    
    // Format the value with thousand separators
    const formatted = formatNumberInput(numericValue);
    setFormattedJumlah(formatted);
    
    // Update the form value with the cleaned numeric value
    const numericAmount = cleanNumberInput(formatted);
    form.setValue('jumlah', numericAmount);
  };
  
  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File size validation (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    
    // Read and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setFilePreview(base64String);
      form.setValue('bukti', base64String);
    };
    reader.readAsDataURL(file);
  };
  
  // Form submission handler
  const onSubmit = (values: FormValues) => {
    try {
      const transactionData = {
        tanggal: format(values.tanggal, 'yyyy-MM-dd'),
        kategori: values.kategori, 
        jumlah: values.jumlah,
        keterangan: values.keterangan,
        jenis: values.jenis,
        bukti: values.bukti
      };
      
      if (isEdit && initialData) {
        updatePemasukanPengeluaran(initialData.id, transactionData);
        toast.success('Transaksi berhasil diperbarui');
      } else {
        createPemasukanPengeluaran({
          ...transactionData,
          createdBy: 'user_1' // Normally this would come from auth context
        });
        toast.success('Transaksi berhasil disimpan');
      }
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Gagal menyimpan transaksi');
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
                  <Select 
                    onValueChange={(value: 'Pemasukan' | 'Pengeluaran') => {
                      field.onChange(value);
                      // Reset category when transaction type changes
                      form.setValue('kategori', '');
                    }}
                    defaultValue={field.value}
                  >
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
            
            {/* Date Field */}
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tanggal</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: id })
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Category Field */}
            <FormField
              control={form.control}
              name="kategori"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map(category => (
                        <SelectItem key={category.id} value={category.nama}>
                          {category.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Amount Field */}
            <FormField
              control={form.control}
              name="jumlah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah (Rp)</FormLabel>
                  <FormControl>
                    <Input 
                      value={formattedJumlah} 
                      onChange={handleAmountChange}
                      placeholder="Contoh: 1.000.000"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description Field */}
            <FormField
              control={form.control}
              name="keterangan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keterangan</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* File Upload */}
            <FormItem>
              <FormLabel>Bukti Transaksi (opsional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </FormControl>
              {filePreview && (
                <div className="mt-2">
                  {filePreview.startsWith('data:image') ? (
                    <img src={filePreview} alt="Bukti transaksi" className="w-40 h-auto object-contain border rounded-md" />
                  ) : (
                    <div className="p-4 border rounded-md bg-slate-100 text-sm">
                      Dokumen tersedia
                    </div>
                  )}
                </div>
              )}
            </FormItem>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Batal
                </Button>
              )}
              <Button type="submit">
                {isEdit ? 'Update' : 'Simpan'} Transaksi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
