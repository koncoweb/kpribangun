
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaksi, AnggotaKeluarga } from "@/types";
import { TransactionTable } from "./TransactionTable";
import { JatuhTempoTable } from "./JatuhTempoTable";
import { TunggakanTable } from "./TunggakanTable";
import { KeluargaTable } from "./KeluargaTable";

interface TransactionTabsProps {
  transaksi: Transaksi[];
  simpananTransaksi: Transaksi[];
  pinjamanTransaksi: Transaksi[];
  angsuranTransaksi: Transaksi[];
  jatuhTempo: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysUntilDue: number;
  }[];
  tunggakan: {
    transaksi: Transaksi;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[];
  keluarga?: AnggotaKeluarga[];
  anggotaId?: string;
}

export function TransactionTabs({
  transaksi,
  simpananTransaksi,
  pinjamanTransaksi,
  angsuranTransaksi,
  jatuhTempo,
  tunggakan,
  keluarga = [],
  anggotaId,
}: TransactionTabsProps) {
  return (
    <Tabs defaultValue="semua">
      <TabsList className="mb-4">
        <TabsTrigger value="semua">Semua</TabsTrigger>
        <TabsTrigger value="simpanan">Simpanan</TabsTrigger>
        <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
        <TabsTrigger value="angsuran">Angsuran</TabsTrigger>
        <TabsTrigger value="jatuhTempo">Jatuh Tempo</TabsTrigger>
        <TabsTrigger value="tunggakan">Tunggakan</TabsTrigger>
        <TabsTrigger value="keluarga">Data Keluarga</TabsTrigger>
      </TabsList>
      
      <TabsContent value="semua">
        <TransactionTable transaksi={transaksi} />
      </TabsContent>
      <TabsContent value="simpanan">
        <TransactionTable transaksi={simpananTransaksi} />
      </TabsContent>
      <TabsContent value="pinjaman">
        <TransactionTable transaksi={pinjamanTransaksi} />
      </TabsContent>
      <TabsContent value="angsuran">
        <TransactionTable transaksi={angsuranTransaksi} />
      </TabsContent>
      <TabsContent value="jatuhTempo">
        <JatuhTempoTable jatuhTempo={jatuhTempo} />
      </TabsContent>
      <TabsContent value="tunggakan">
        <TunggakanTable tunggakan={tunggakan} />
      </TabsContent>
      <TabsContent value="keluarga">
        <KeluargaTable keluarga={keluarga} anggotaId={anggotaId} readOnly={true} />
      </TabsContent>
    </Tabs>
  );
}
