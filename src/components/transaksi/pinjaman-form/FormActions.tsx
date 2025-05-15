
import React from "react";
import { Button } from "@/components/ui/button";

export interface FormActionsProps {
  cancelAction: () => void;
  isSubmitting: boolean;
}

export function FormActions({ cancelAction, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={cancelAction}
        disabled={isSubmitting}
      >
        Batal
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan Pinjaman"}
      </Button>
    </div>
  );
}
