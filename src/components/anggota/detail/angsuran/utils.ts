
import { Transaksi } from "@/types";
import { getAllTransaksi, getTransaksiById } from "@/services/transaksi";
import { AngsuranDetail } from "./types";

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/**
 * Calculate angsuran details for a specific loan
 */
export function calculateAngsuran(pinjamanId: string): AngsuranDetail[] {
  const pinjaman = getTransaksiById(pinjamanId);
  if (!pinjaman) return [];

  const angsuranDetails: AngsuranDetail[] = [];
  const pinjamanDate = new Date(pinjaman.tanggal);
  let tenor = 12; // Default tenor
  let angsuranPerBulan = Math.ceil(pinjaman.jumlah / tenor);

  // Try to parse tenor and angsuran per bulan from keterangan
  if (pinjaman.keterangan) {
    const tenorMatch = pinjaman.keterangan.match(/Tenor: (\d+) bulan/);
    const angsuranMatch = pinjaman.keterangan.match(/Angsuran per bulan: Rp ([0-9,.]+)/);
    
    if (tenorMatch && tenorMatch[1]) {
      tenor = parseInt(tenorMatch[1]);
    }
    
    if (angsuranMatch && angsuranMatch[1]) {
      angsuranPerBulan = parseInt(angsuranMatch[1].replace(/[,.]/g, ""));
    }
  }

  // Get all angsuran transactions for this pinjaman
  const allTransaksi = getAllTransaksi();
  const angsuranTransaksi = allTransaksi.filter(
    (t) => 
      t.jenis === "Angsuran" && 
      t.status === "Sukses" && 
      t.keterangan && 
      t.keterangan.includes(pinjamanId)
  );

  // Generate angsuran schedule
  let totalTerbayar = 0;
  for (let i = 0; i < tenor; i++) {
    const jatuhTempoDate = new Date(pinjamanDate);
    jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + i + 1);
    
    // Find if this angsuran has been paid
    const relatedAngsuran = angsuranTransaksi.find(t => {
      const match = t.keterangan?.match(/Angsuran ke-(\d+)/);
      return match && parseInt(match[1]) === (i + 1);
    });

    totalTerbayar += relatedAngsuran ? relatedAngsuran.jumlah : 0;
    
    angsuranDetails.push({
      nomorAngsuran: i + 1,
      tanggalJatuhTempo: jatuhTempoDate.toISOString(),
      nominal: i === tenor - 1 ? (pinjaman.jumlah - totalTerbayar) : angsuranPerBulan,
      status: relatedAngsuran ? "Terbayar" : "Belum Terbayar",
      transaksiId: relatedAngsuran?.id
    });
  }
  
  return angsuranDetails;
}
