
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Pencil, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Pengajuan } from "@/types";

interface PengajuanActionsProps {
  pengajuan: Pengajuan;
  onView: (pengajuan: Pengajuan) => void;
  onEdit: (pengajuan: Pengajuan) => void;
  onApprove: (pengajuan: Pengajuan) => void;
  onReject: (pengajuan: Pengajuan) => void;
  onDelete: (pengajuan: Pengajuan) => void;
}

export function PengajuanActions({
  pengajuan,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete
}: PengajuanActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onView(pengajuan)}
          className="flex items-center gap-2"
        >
          <Eye size={16} /> Lihat Detail
        </DropdownMenuItem>
        
        {pengajuan.status === "Menunggu" && (
          <>
            <DropdownMenuItem 
              onClick={() => onEdit(pengajuan)}
              className="flex items-center gap-2"
            >
              <Pencil size={16} /> Edit
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onApprove(pengajuan)}
              className="flex items-center gap-2 text-green-600"
            >
              <CheckCircle size={16} /> Setujui
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => onReject(pengajuan)}
              className="flex items-center gap-2 text-amber-600"
            >
              <XCircle size={16} /> Tolak
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem 
          onClick={() => onDelete(pengajuan)}
          className="flex items-center gap-2 text-red-600"
        >
          <Trash2 size={16} /> Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
