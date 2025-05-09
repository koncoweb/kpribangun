
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEdit: boolean;
  onCancel?: () => void;
}

export function FormActions({ isEdit, onCancel }: FormActionsProps) {
  return (
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
  );
}
