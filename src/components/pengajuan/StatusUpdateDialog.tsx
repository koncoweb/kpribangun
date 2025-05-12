
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (status: "Menunggu" | "Disetujui" | "Ditolak") => void;
  currentStatus: string;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: string;
}

export function StatusUpdateDialog({
  open,
  onOpenChange,
  onConfirm,
  currentStatus,
  title = "Ubah Status Pengajuan",
  description = "Pilih status baru untuk pengajuan ini.",
  confirmLabel = "Simpan Perubahan",
  confirmVariant = "default"
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<"Menunggu" | "Disetujui" | "Ditolak">(
    currentStatus as "Menunggu" | "Disetujui" | "Ditolak"
  );
  
  const handleConfirm = () => {
    onConfirm(selectedStatus);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Label htmlFor="status">Status</Label>
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as "Menunggu" | "Disetujui" | "Ditolak")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Menunggu">Menunggu</SelectItem>
              <SelectItem value="Disetujui">Disetujui</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedStatus === "Disetujui" && (
            <p className="text-sm text-amber-600 mt-2">
              Perhatian: Mengubah status menjadi Disetujui akan membuat transaksi baru.
            </p>
          )}
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={confirmVariant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
