
import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { TransactionFormValues } from '../schema';

interface FileUploadFieldProps {
  control: Control<TransactionFormValues>;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
}

export function FileUploadField({ 
  control, 
  filePreview, 
  setFilePreview 
}: FileUploadFieldProps) {
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
      return base64String;
    };
    reader.readAsDataURL(file);
  };

  return (
    <FormField
      control={control}
      name="bukti"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bukti Transaksi (opsional)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => {
                handleFileChange(e);
                // The actual value will be set by the reader.onload callback
              }}
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
      )}
    />
  );
}
