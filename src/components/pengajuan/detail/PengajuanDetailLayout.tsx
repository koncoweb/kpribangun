
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Pengajuan, Anggota } from "@/types";
import { PengajuanHeader } from "@/components/pengajuan/PengajuanHeader";
import { PengajuanDetailCard } from "@/components/pengajuan/PengajuanDetailCard";
import { PengajuanActionCard } from "@/components/pengajuan/PengajuanActionCard";

interface PengajuanDetailLayoutProps {
  pengajuan: Pengajuan;
  anggota: Anggota | null;
  onDeleteClick: () => void;
  onApproveClick: () => void;
  onRejectClick: () => void;
  onChangeStatusClick: () => void;
}

export default function PengajuanDetailLayout({
  pengajuan,
  anggota,
  onDeleteClick,
  onApproveClick,
  onRejectClick,
  onChangeStatusClick
}: PengajuanDetailLayoutProps) {
  return (
    <>
      <PengajuanHeader 
        id={pengajuan.id} 
        onDeleteClick={onDeleteClick} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PengajuanDetailCard 
            pengajuan={pengajuan}
            anggota={anggota}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </div>

        <div>
          <PengajuanActionCard 
            status={pengajuan.status}
            onApprove={onApproveClick}
            onReject={onRejectClick}
            onChangeStatus={onChangeStatusClick}
          />
        </div>
      </div>
    </>
  );
}
