
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { PemasukanPengeluaran, KategoriTransaksi } from '@/types';
import { getAllKategoriTransaksi, createPemasukanPengeluaran, updatePemasukanPengeluaran } from '@/services/keuanganService';
import { formatNumberInput } from '@/utils/formatters';
import { transactionFormSchema, TransactionFormValues } from './schema';
import { TransactionTypeField } from './forms/TransactionTypeField';
import { DateField } from './forms/DateField';
import { CategoryField } from './forms/CategoryField';
import { AmountField } from './forms/AmountField';
import { DescriptionField } from './forms/DescriptionField';
import { FileUploadField } from './forms/FileUploadField';
import { FormActions } from './forms/FormActions';

interface TransaksiFormProps {
  initialData?: PemasukanPengeluaran;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TransaksiForm({ initialData, onSuccess, onCancel }: TransaksiFormProps) {
  const [categories, setCategories] = useState<KategoriTransaksi[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.bukti || null);
  const [formattedJumlah, setFormattedJumlah] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<KategoriTransaksi[]>([]);
  const isEdit = !!initialData;
  
  // Initialize form with data if editing
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
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
    
    // Initial filtering based on current type
    const currentType = form.watch('jenis');
    setFilteredCategories(allCategories.filter(cat => cat.jenis === currentType));
  }, []);
  
  // Handle transaction type change
  const handleTransactionTypeChange = (type: 'Pemasukan' | 'Pengeluaran') => {
    // Reset category when transaction type changes
    form.setValue('kategori', '');
    
    // Filter categories based on selected transaction type
    setFilteredCategories(categories.filter(cat => cat.jenis === type));
  };
  
  // Handle file upload value setting
  const handleSetFilePreview = (preview: string | null) => {
    setFilePreview(preview);
    if (preview) {
      form.setValue('bukti', preview);
    }
  };
  
  // Form submission handler
  const onSubmit = (values: TransactionFormValues) => {
    try {
      const transactionData = {
        tanggal: values.tanggal.toISOString().split('T')[0],
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
            <TransactionTypeField 
              control={form.control} 
              onTypeChange={handleTransactionTypeChange} 
            />
            
            {/* Date Field */}
            <DateField control={form.control} />
            
            {/* Category Field */}
            <CategoryField 
              control={form.control} 
              categories={filteredCategories} 
            />
            
            {/* Amount Field */}
            <AmountField 
              control={form.control}
              formattedJumlah={formattedJumlah}
              setFormattedJumlah={setFormattedJumlah}
            />
            
            {/* Description Field */}
            <DescriptionField control={form.control} />
            
            {/* File Upload */}
            <FileUploadField 
              control={form.control} 
              filePreview={filePreview}
              setFilePreview={handleSetFilePreview}
            />
            
            {/* Form Actions */}
            <FormActions 
              isEdit={isEdit} 
              onCancel={onCancel} 
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
