
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAnggotaById, updateAnggota } from "@/services/anggotaService";
import { 
  getTransaksiByAnggotaId, 
  calculateTotalSimpanan, 
  calculateTotalPinjaman, 
  getOverdueLoans,
  getUpcomingDueLoans,
  calculateJatuhTempo,
  calculatePenalty
} from "@/services/transaksi";
import { Anggota, Transaksi, AnggotaKeluarga } from "@/types";
import { ProfileCard } from "@/components/anggota/detail/ProfileCard";
import { InfoCard } from "@/components/anggota/detail/InfoCard";
import { TransactionTabs } from "@/components/anggota/detail/TransactionTabs";
import { Badge } from "@/components/ui/badge";
import { KeluargaTable } from "@/components/anggota/detail/KeluargaTable";
import { DetailPageHeader } from "@/components/pos/detail/DetailPageHeader";
import { KeluargaFormDialog } from "@/components/anggota/keluarga/KeluargaFormDialog";
import { DeleteKeluargaDialog } from "@/components/anggota/keluarga/DeleteKeluargaDialog";

export default function AnggotaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [jatuhTempo, setJatuhTempo] = useState<{
    transaksi: Transaksi;
    jatuhTempo: string;
    daysUntilDue: number;
  }[]>([]);
  const [tunggakan, setTunggakan] = useState<{
    transaksi: Transaksi;
    jatuhTempo: string;
    daysOverdue: number;
    penalty: number;
  }[]>([]);

  // Family data state and form management
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentKeluarga, setCurrentKeluarga] = useState<AnggotaKeluarga>({
    id: "",
    nama: "",
    hubungan: "Anak",
    alamat: "",
    noHp: "",
  });
  const [keluargaToDelete, setKeluargaToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    nama?: string;
    hubungan?: string;
    alamat?: string;
    noHp?: string;
  }>({});
  
  useEffect(() => {
    if (id) {
      try {
        const foundAnggota = getAnggotaById(id);
        if (foundAnggota) {
          setAnggota(foundAnggota);
          
          // Get all transactions for this member
          const anggotaTransaksi = getTransaksiByAnggotaId(id);
          setTransaksi(anggotaTransaksi);
          
          try {
            // Get upcoming due loans
            const upcomingDue = getUpcomingDueLoans()
              .filter(item => item.transaksi.anggotaId === id)
              .map(item => ({
                transaksi: item.transaksi,
                jatuhTempo: item.jatuhTempo,
                daysUntilDue: item.daysUntilDue
              }));
            setJatuhTempo(upcomingDue);
            
            // Get overdue loans
            const overdue = getOverdueLoans()
              .filter(item => item.transaksi.anggotaId === id)
              .map(item => ({
                transaksi: item.transaksi,
                jatuhTempo: item.jatuhTempo,
                daysOverdue: item.daysOverdue,
                penalty: calculatePenalty(item.transaksi.jumlah, item.daysOverdue)
              }));
            setTunggakan(overdue);
          } catch (error) {
            console.error("Error processing loan data:", error);
            toast({
              title: "Warning",
              description: "Terjadi kesalahan saat memuat data pinjaman",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Anggota tidak ditemukan",
            description: "Data anggota yang dicari tidak ditemukan",
            variant: "destructive",
          });
          navigate("/anggota");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
          variant: "destructive",
        });
        navigate("/anggota");
      }
    }
  }, [id, navigate, toast]);
  
  // Family CRUD functions
  const resetKeluargaForm = () => {
    setCurrentKeluarga({
      id: "",
      nama: "",
      hubungan: "Anak",
      alamat: "",
      noHp: "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetKeluargaForm();
    }
  };

  const handleAddKeluarga = () => {
    setIsDialogOpen(true);
    resetKeluargaForm();
  };

  const handleEditKeluarga = (keluargaId: string) => {
    if (!anggota || !anggota.keluarga) return;
    
    const keluargaToEdit = anggota.keluarga.find(k => k.id === keluargaId);
    if (keluargaToEdit) {
      setCurrentKeluarga(keluargaToEdit);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteKeluarga = (keluargaId: string) => {
    setKeluargaToDelete(keluargaId);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentKeluarga(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if user is typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setCurrentKeluarga(prev => ({
      ...prev,
      hubungan: value as "Anak" | "Suami" | "Istri" | "Orang Tua" | "Saudara Kandung" | "Kerabat"
    }));
    
    // Clear error for hubungan if user selects a value
    if (errors.hubungan) {
      setErrors(prev => ({ ...prev, hubungan: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      hubungan?: string;
      alamat?: string;
      noHp?: string;
    } = {};
    
    if (!currentKeluarga.nama.trim()) {
      newErrors.nama = "Nama tidak boleh kosong";
    }
    
    if (!currentKeluarga.hubungan) {
      newErrors.hubungan = "Hubungan harus dipilih";
    }
    
    if (!currentKeluarga.alamat.trim()) {
      newErrors.alamat = "Alamat tidak boleh kosong";
    }
    
    if (!currentKeluarga.noHp.trim()) {
      newErrors.noHp = "Nomor HP tidak boleh kosong";
    } else if (!/^[0-9]{10,13}$/.test(currentKeluarga.noHp.replace(/\s/g, ''))) {
      newErrors.noHp = "Nomor HP harus berisi 10-13 digit angka";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeluargaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !anggota) {
      return;
    }

    // Create a new array of keluarga with modifications
    const updatedKeluarga = anggota.keluarga ? [...anggota.keluarga] : [];
    
    if (isEditing) {
      // Update existing family member
      const index = updatedKeluarga.findIndex(k => k.id === currentKeluarga.id);
      if (index !== -1) {
        updatedKeluarga[index] = currentKeluarga;
      }
      toast({
        title: "Data keluarga berhasil diperbarui",
      });
    } else {
      // Add new family member
      const newKeluarga = {
        ...currentKeluarga,
        id: `keluarga-${Date.now()}`
      };
      updatedKeluarga.push(newKeluarga);
      toast({
        title: "Anggota keluarga berhasil ditambahkan",
      });
    }

    // Update anggota object with new keluarga data
    const updatedAnggota = {
      ...anggota,
      keluarga: updatedKeluarga
    };

    // Persist changes to local storage
    updateAnggota(anggota.id, { keluarga: updatedKeluarga });
    
    // Update local state
    setAnggota(updatedAnggota);
    
    // Close dialog and reset form
    setIsDialogOpen(false);
    resetKeluargaForm();
  };

  const handleDeleteConfirmed = () => {
    if (!keluargaToDelete || !anggota || !anggota.keluarga) return;

    // Filter out the deleted keluarga
    const updatedKeluarga = anggota.keluarga.filter(k => k.id !== keluargaToDelete);
    
    // Update anggota object with new keluarga data
    const updatedAnggota = {
      ...anggota,
      keluarga: updatedKeluarga
    };

    // Persist changes to local storage
    updateAnggota(anggota.id, { keluarga: updatedKeluarga });
    
    // Update local state
    setAnggota(updatedAnggota);
    
    toast({
      title: "Anggota keluarga berhasil dihapus",
    });
    
    setKeluargaToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  
  if (!anggota) {
    return (
      <Layout pageTitle="Detail Anggota">
        <div className="flex justify-center items-center h-64">
          <p>Memuat data anggota...</p>
        </div>
      </Layout>
    );
  }
  
  const totalSimpanan = calculateTotalSimpanan(anggota.id);
  const totalPinjaman = calculateTotalPinjaman(anggota.id);
  const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan");
  const pinjamanTransaksi = transaksi.filter(t => t.jenis === "Pinjam");
  const angsuranTransaksi = transaksi.filter(t => t.jenis === "Angsuran");

  const keluargaCount = anggota.keluarga?.length || 0;
  const dokumenCount = anggota.dokumen?.length || 0;

  return (
    <Layout pageTitle={`Detail Anggota - ${anggota.nama}`}>
      <DetailPageHeader title="Detail Anggota" backLink="/anggota" />
      
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">{anggota.nama}</h1>
        {keluargaCount > 0 && (
          <Badge variant="info" className="ml-2">
            {keluargaCount} Anggota Keluarga
          </Badge>
        )}
        {dokumenCount > 0 && (
          <Badge variant="success" className="ml-2">
            {dokumenCount} Dokumen
          </Badge>
        )}
        <div className="ml-auto">
          <Button asChild variant="outline" size="sm">
            <Link to={`/anggota/edit/${anggota.id}`}>
              <Edit size={16} className="mr-1.5" /> Edit
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-4">
          <ProfileCard anggota={anggota} />
        </div>
        
        <div className="lg:col-span-8">
          <InfoCard anggota={anggota} totalSimpanan={totalSimpanan} totalPinjaman={totalPinjaman} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Data Keluarga</CardTitle>
            <Button onClick={handleAddKeluarga} size="sm">
              <Plus size={16} className="mr-1" /> Tambah Keluarga
            </Button>
          </CardHeader>
          <CardContent>
            <KeluargaTable 
              keluarga={anggota.keluarga || []} 
              anggotaId={anggota.id} 
              onEdit={handleEditKeluarga}
              onDelete={handleDeleteKeluarga}
              readOnly={false}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Histori Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTabs
            transaksi={transaksi}
            simpananTransaksi={simpananTransaksi}
            pinjamanTransaksi={pinjamanTransaksi}
            angsuranTransaksi={angsuranTransaksi}
            jatuhTempo={jatuhTempo}
            tunggakan={tunggakan}
            keluarga={anggota.keluarga || []}
            anggotaId={anggota.id}
          />
        </CardContent>
      </Card>

      {/* Keluarga Form Dialog */}
      <KeluargaFormDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpen}
        onSubmit={handleKeluargaSubmit}
        currentKeluarga={currentKeluarga}
        isEditing={isEditing}
        errors={errors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteKeluargaDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Layout>
  );
}
