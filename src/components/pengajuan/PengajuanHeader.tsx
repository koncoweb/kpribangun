
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";

interface PengajuanHeaderProps {
  id: string;
  onDeleteClick: () => void;
}

export function PengajuanHeader({ id, onDeleteClick }: PengajuanHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link to="/transaksi/pengajuan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Detail Pengajuan</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = `/transaksi/pengajuan/${id}/edit`}
        >
          <Edit size={16} className="mr-2" />
          Edit
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onDeleteClick}
        >
          <Trash size={16} className="mr-2" />
          Hapus
        </Button>
      </div>
    </div>
  );
}
