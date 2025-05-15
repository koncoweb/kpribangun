
import { formatCurrency } from "@/utils/formatters";

export interface LoanSummaryProps {
  kategori: string;
  jumlah: number;
  bunga: number;
  tenor: number;
  angsuran: number;
}

export function LoanSummary({ kategori, jumlah, bunga, tenor, angsuran }: LoanSummaryProps) {
  return (
    <div className="bg-amber-50 p-4 rounded-md">
      <div className="mb-2 font-semibold">Ringkasan Pinjaman</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Kategori Pinjaman:</p>
          <p className="font-medium">Pinjaman {kategori}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pokok Pinjaman:</p>
          <p className="font-medium">{formatCurrency(jumlah)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Bunga:</p>
          <p className="font-medium">{bunga}% (Flat)</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tenor:</p>
          <p className="font-medium">{tenor} bulan</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Angsuran per Bulan:</p>
          <p className="font-medium">{formatCurrency(angsuran)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Pembayaran:</p>
          <p className="font-medium">{formatCurrency(angsuran * tenor)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Bunga:</p>
          <p className="font-medium">{formatCurrency(angsuran * tenor - jumlah)}</p>
        </div>
      </div>
    </div>
  );
}
