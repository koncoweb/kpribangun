
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { History, Search, FileText, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Penjualan } from "@/types";
import { 
  getAllPenjualan, 
  deletePenjualan, 
  updatePenjualan 
} from "@/services/penjualanService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from "@/lib/utils";

export default function RiwayatTransaksi() {
  const { toast } = useToast();
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "sukses" | "dibatalkan">("all");
  const [filteredPenjualan, setFilteredPenjualan] = useState<Penjualan[]>([]);

  // Load penjualan on component mount
  useEffect(() => {
    loadPenjualan();
  }, []);

  // Filter penjualan when search query, filter status or penjualan list changes
  useEffect(() => {
    let filtered = penjualanList;
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nomorTransaksi.toLowerCase().includes(query) ||
          item.tanggal.includes(query) ||
          item.metodePembayaran.includes(query)
      );
    }
    
    setFilteredPenjualan(filtered);
  }, [searchQuery, filterStatus, penjualanList]);

  const loadPenjualan = () => {
    const allPenjualan = getAllPenjualan();
    // Sort by date descending (newest first)
    const sorted = [...allPenjualan].sort((a, b) => 
      new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    setPenjualanList(sorted);
    setFilteredPenjualan(sorted);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter status change
  const handleFilterStatusChange = (value: string) => {
    setFilterStatus(value as "all" | "sukses" | "dibatalkan");
  };

  // Handle view transaction
  const handleViewTransaction = (id: string) => {
    window.location.href = `/pos/penjualan/${id}`;
  };

  // Handle cancel transaction
  const handleCancelTransaction = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan transaksi ini? Stok produk akan dikembalikan.")) {
      try {
        updatePenjualan(id, { status: "dibatalkan" });
        loadPenjualan();
        
        toast({
          title: "Sukses",
          description: "Transaksi berhasil dibatalkan dan stok dikembalikan",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal membatalkan transaksi",
          variant: "destructive",
        });
      }
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        deletePenjualan(id);
        loadPenjualan();
        
        toast({
          title: "Sukses",
          description: "Transaksi berhasil dihapus",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus transaksi",
          variant: "destructive",
        });
      }
    }
  };

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    const methodMap: Record<string, string> = {
      cash: "Tunai",
      debit: "Kartu Debit",
      kredit: "Kartu Kredit",
      qris: "QRIS"
    };
    return methodMap[method] || method;
  };

  return (
    <Layout pageTitle="Riwayat Transaksi">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Riwayat Transaksi</h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle>Riwayat Transaksi Penjualan</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari transaksi..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
                <Select onValueChange={handleFilterStatusChange} defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="sukses">Sukses</SelectItem>
                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {penjualanList.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Belum ada data transaksi penjualan.
                </AlertDescription>
              </Alert>
            ) : filteredPenjualan.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Tidak ada transaksi yang cocok dengan filter atau pencarian Anda.
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPenjualan.map((penjualan) => (
                    <TableRow key={penjualan.id}>
                      <TableCell className="font-medium">{penjualan.nomorTransaksi}</TableCell>
                      <TableCell>
                        {new Date(penjualan.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>{formatRupiah(penjualan.total)}</TableCell>
                      <TableCell>{formatPaymentMethod(penjualan.metodePembayaran)}</TableCell>
                      <TableCell>
                        <Badge variant={penjualan.status === "sukses" ? "success" : "destructive"}>
                          {penjualan.status === "sukses" ? "Sukses" : "Dibatalkan"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewTransaction(penjualan.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Detail
                        </Button>
                        {penjualan.status === "sukses" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCancelTransaction(penjualan.id)}
                          >
                            Batalkan
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteTransaction(penjualan.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
