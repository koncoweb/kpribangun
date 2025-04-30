
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, PiggyBank, Wallet, TrendingUp, 
  ArrowRight, Plus 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    { label: "Total Anggota", value: "120", icon: Users, color: "text-blue-600" },
    { label: "Total Simpanan", value: "Rp 253.500.000", icon: PiggyBank, color: "text-green-600" },
    { label: "Total Pinjaman", value: "Rp 175.750.000", icon: Wallet, color: "text-amber-600" },
    { label: "Pendapatan Bunga", value: "Rp 8.230.000", icon: TrendingUp, color: "text-purple-600" },
  ];

  const recentMembers = [
    { id: "AG0001", name: "Budi Santoso", joinDate: "15 Apr 2025", saving: "Rp 2.500.000", loan: "Rp 5.000.000" },
    { id: "AG0002", name: "Dewi Lestari", joinDate: "12 Apr 2025", saving: "Rp 3.750.000", loan: "Rp 0" },
    { id: "AG0003", name: "Ahmad Hidayat", joinDate: "10 Apr 2025", saving: "Rp 1.250.000", loan: "Rp 2.500.000" },
    { id: "AG0004", name: "Sri Wahyuni", joinDate: "08 Apr 2025", saving: "Rp 5.000.000", loan: "Rp 10.000.000" },
  ];

  const recentTransactions = [
    { date: "20 Apr 2025", memberName: "Budi Santoso", type: "Simpan", amount: "Rp 500.000", status: "Sukses" },
    { date: "18 Apr 2025", memberName: "Sri Wahyuni", type: "Pinjam", amount: "Rp 2.000.000", status: "Sukses" },
    { date: "17 Apr 2025", memberName: "Ahmad Hidayat", type: "Bayar Cicilan", amount: "Rp 250.000", status: "Sukses" },
    { date: "15 Apr 2025", memberName: "Dewi Lestari", type: "Simpan", amount: "Rp 750.000", status: "Sukses" },
  ];

  return (
    <Layout pageTitle="Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card">
            <div className="flex justify-between items-start">
              <span className="stat-label">{stat.label}</span>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <span className="stat-value">{stat.value}</span>
          </Card>
        ))}
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/anggota/tambah">
          <Button className="w-full bg-gradient-to-r from-koperasi-blue to-blue-600 hover:from-blue-600 hover:to-koperasi-blue h-16">
            <Users className="mr-2 h-5 w-5" /> Tambah Anggota Baru
          </Button>
        </Link>
        <Link to="/transaksi/baru">
          <Button className="w-full bg-gradient-to-r from-koperasi-green to-green-600 hover:from-green-600 hover:to-koperasi-green h-16">
            <PiggyBank className="mr-2 h-5 w-5" /> Buat Transaksi Baru
          </Button>
        </Link>
      </div>
      
      {/* Recent Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 bg-white border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-koperasi-dark">Anggota Terbaru</h2>
            <Link to="/anggota">
              <Button variant="outline" size="sm" className="gap-1">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">ID</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Nama</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Simpanan</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Pinjaman</th>
                </tr>
              </thead>
              <tbody>
                {recentMembers.map((member, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4 text-sm">{member.id}</td>
                    <td className="py-3 px-4 text-sm font-medium">{member.name}</td>
                    <td className="py-3 px-4 text-sm text-green-600">{member.saving}</td>
                    <td className="py-3 px-4 text-sm text-amber-600">{member.loan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        {/* Recent Transactions */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 bg-white border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-koperasi-dark">Transaksi Terbaru</h2>
            <Link to="/transaksi">
              <Button variant="outline" size="sm" className="gap-1">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Tanggal</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Anggota</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Tipe</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 px-4 text-sm">{transaction.date}</td>
                    <td className="py-3 px-4 text-sm font-medium">{transaction.memberName}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === "Simpan" ? "bg-green-100 text-green-800" :
                        transaction.type === "Pinjam" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
