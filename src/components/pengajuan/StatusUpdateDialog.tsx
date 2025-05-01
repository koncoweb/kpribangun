
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  status: "Menunggu" | "Disetujui" | "Ditolak" | "";
  onStatusChange: (value: "Menunggu" | "Disetujui" | "Ditolak") => void;
}

export function StatusUpdateDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  status,
  onStatusChange
}: StatusUpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {status ? `Ubah Status ke ${status}` : "Ubah Status Pengajuan"}
          </DialogTitle>
          <DialogDescription>
            {status ? (
              status === "Disetujui" 
                ? "Pengajuan yang disetujui dapat diproses lebih lanjut menjadi transaksi."
                : "Pengajuan yang ditolak tidak dapat diproses lebih lanjut."
            ) : (
              "Pilih status baru untuk pengajuan ini."
            )}
          </DialogDescription>
        </DialogHeader>

        {!status && (
          <div className="py-4">
            <Select onValueChange={(value: "Menunggu" | "Disetujui" | "Ditolak") => onStatusChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menunggu">Menunggu</SelectItem>
                <SelectItem value="Disetujui">Disetujui</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={!status && status !== ""}
            className={
              status === "Disetujui" ? "bg-green-600 hover:bg-green-700" :
              status === "Ditolak" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            Konfirmasi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
