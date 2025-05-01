
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pengajuan, Anggota } from "@/types";

interface PengajuanDetailCardProps {
  pengajuan: Pengajuan;
  anggota: Anggota | null;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export function PengajuanDetailCard({ 
  pengajuan, 
  anggota, 
  formatDate,
  formatCurrency 
}: PengajuanDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Informasi Pengajuan #{pengajuan.id}</span>
          <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
            pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
            pengajuan.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}>
            {pengajuan.status}
          </span>
        </CardTitle>
        <CardDescription>
          Diajukan pada {formatDate(pengajuan.tanggal)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Detail Pengajuan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Jenis Pengajuan</p>
              <p className="font-medium">
                <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                  pengajuan.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                  "bg-amber-100 text-amber-800"
                }`}>
                  {pengajuan.jenis === "Simpan" ? "Simpanan" : "Pinjaman"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jumlah</p>
              <p className="font-medium">
                {formatCurrency(pengajuan.jumlah)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {anggota && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Informasi Anggota</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nama Anggota</p>
                <p className="font-medium">{anggota.nama}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ID Anggota</p>
                <p className="font-medium">{anggota.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No. Telepon</p>
                <p className="font-medium">{anggota.noHp}</p>
              </div>
            </div>
          </div>
        )}

        {pengajuan.keterangan && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Keterangan</h3>
              <p className="text-gray-700">{pengajuan.keterangan}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Terakhir diperbarui: {formatDate(pengajuan.updatedAt)}
        </div>
      </CardFooter>
    </Card>
  );
}
