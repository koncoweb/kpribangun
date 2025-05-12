
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, Eye, FileText, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Transaksi } from "@/types";
import { EditTransaksiForm } from "./EditTransaksiForm";
import { DeleteTransaksiDialog } from "./DeleteTransaksiDialog";
import { deleteTransaksi } from "@/services/transaksi/deleteTransaksi";

interface PinjamTableActionsProps {
  transaksi: Transaksi;
  onTransaksiModified: () => void;
}

export function PinjamTableActions({ transaksi, onTransaksiModified }: PinjamTableActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle view transaction
  const handleView = () => {
    navigate(`/transaksi/${transaksi.id}`);
  };

  // Handle print transaction
  const handlePrint = () => {
    navigate(`/transaksi/${transaksi.id}/cetak`);
  };

  // Handle edit transaction
  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  // Handle delete transaction
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    try {
      const isDeleted = deleteTransaksi(transaksi.id);
      
      if (isDeleted) {
        toast({
          title: "Transaksi berhasil dihapus",
          description: `Transaksi dengan ID ${transaksi.id} telah dihapus`
        });
        onTransaksiModified();
        setIsDeleteDialogOpen(false);
      } else {
        toast({
          title: "Gagal menghapus transaksi",
          description: "Transaksi tidak ditemukan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus transaksi. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={handleView}
            className="flex items-center gap-2"
          >
            <Eye size={16} /> Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <FileText size={16} /> Cetak Bukti
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Pencil size={16} /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600"
          >
            <Trash2 size={16} /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Transaksi {transaksi.id}</DialogTitle>
          </DialogHeader>
          <EditTransaksiForm 
            transaksi={transaksi}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onTransaksiModified();
            }}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <DeleteTransaksiDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        transaksi={transaksi}
      />
    </>
  );
}
