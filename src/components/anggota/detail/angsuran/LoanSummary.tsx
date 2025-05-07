
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface LoanSummaryProps {
  selectedLoan: Transaksi;
  remainingAmount: number;
  simpananBalance: number;
  onBayarAngsuran: (pinjamanId: string) => void;
  selectedPinjaman: string;
  disableSelfPayment?: boolean;
}

export function LoanSummary({
  selectedLoan,
  remainingAmount,
  simpananBalance,
  onBayarAngsuran,
  selectedPinjaman,
  disableSelfPayment = false,
}: LoanSummaryProps) {
  // Extract details from keterangan field (assuming it's formatted properly)
  const keterangan = selectedLoan.keterangan || '';
  
  // Extract tenor information
  const tenorMatch = keterangan.match(/Pinjaman (\d+) bulan/);
  const tenor = tenorMatch ? tenorMatch[1] : "?";
  
  // Extract bunga information
  const bungaMatch = keterangan.match(/bunga (\d+(?:\.\d+)?)%/);
  const bunga = bungaMatch ? bungaMatch[1] : "?";
  
  // Extract angsuran information
  const angsuranMatch = keterangan.match(/Angsuran per bulan: Rp ([\d.,]+)/);
  const angsuran = angsuranMatch ? angsuranMatch[1].replace(/\./g, ',') : "?";
  
  // Get officer name if available (format: "Petugas: [NAME]")
  const petugasMatch = keterangan.match(/Petugas: ([^.]+)/);
  const petugas = petugasMatch ? petugasMatch[1].trim() : "Tidak tercatat";

  return (
    <div className="mt-4 mb-6 bg-blue-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Detail Pinjaman</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Pinjaman</p>
          <p className="font-medium">{formatCurrency(selectedLoan.jumlah)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Tenor</p>
          <p className="font-medium">{tenor} bulan</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Bunga</p>
          <p className="font-medium">{bunga}%</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Angsuran per Bulan</p>
          <p className="font-medium">Rp {angsuran}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Sisa Pinjaman</p>
          <p className="font-medium">{formatCurrency(remainingAmount)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge variant={remainingAmount > 0 ? "outline" : "success"}>
            {remainingAmount > 0 ? "Aktif" : "Lunas"}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Simpanan</p>
          <p className="font-medium">{formatCurrency(simpananBalance)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Petugas</p>
          <p className="font-medium">{petugas}</p>
        </div>
      </div>
      
      {!disableSelfPayment && remainingAmount > 0 && (
        <div className="flex justify-end mt-4">
          <Button onClick={() => onBayarAngsuran(selectedPinjaman)} size="sm">
            Bayar Angsuran
          </Button>
        </div>
      )}
    </div>
  );
}
