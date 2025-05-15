
import { formatCurrency } from "@/utils/formatters";

export interface LoanSummaryProps {
  jumlah: number;
  kategori: string;
  bunga: number;
  tenor: number;
  angsuran: number;
}

export function LoanSummary({ jumlah, kategori, bunga, tenor, angsuran }: LoanSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Ringkasan Pinjaman</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted p-4 rounded-md">
        <div>
          <div className="text-sm text-muted-foreground">Jumlah Pinjaman</div>
          <div className="font-medium">{formatCurrency(jumlah)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Kategori</div>
          <div className="font-medium capitalize">{kategori}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Bunga</div>
          <div className="font-medium">{bunga}% per bulan</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Tenor</div>
          <div className="font-medium">{tenor} bulan</div>
        </div>
        <div className="col-span-1 md:col-span-2 border-t pt-2 mt-2">
          <div className="text-sm text-muted-foreground">Angsuran per Bulan</div>
          <div className="font-semibold text-lg text-primary">{formatCurrency(angsuran)}</div>
        </div>
      </div>
    </div>
  );
}
