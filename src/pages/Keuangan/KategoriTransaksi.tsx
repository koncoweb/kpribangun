
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileUp, FileDown } from "lucide-react";
import { KategoriTransaksi } from "@/types";
import { getAllKategoriTransaksi, deleteKategoriTransaksi } from "@/services/keuanganService";
import KategoriForm from "@/components/keuangan/KategoriForm";

export default function KategoriTransaksiPage() {
  const [categories, setCategories] = useState<KategoriTransaksi[]>([]);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KategoriTransaksi | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);
  
  const loadCategories = () => {
    try {
      const data = getAllKategoriTransaksi();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Gagal memuat data kategori");
    }
  };
  
  const handleEditCategory = (category: KategoriTransaksi) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };
  
  const handleDeletePrompt = (category: KategoriTransaksi) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedCategory) {
      try {
        deleteKategoriTransaksi(selectedCategory.id);
        toast.success("Kategori berhasil dihapus");
        loadCategories();
        setIsDeleteOpen(false);
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Gagal menghapus kategori");
      }
    }
  };
  
  const handleFormSuccess = () => {
    loadCategories();
    setIsFormOpen(false);
    setSelectedCategory(null);
  };
  
  // Filter categories based on active tab
  const filteredCategories = activeTab === "semua" 
    ? categories
    : categories.filter(category => category.jenis.toLowerCase() === activeTab);
  
  return (
    <Layout pageTitle="Kategori Transaksi">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Kategori Transaksi</h1>
          <Button onClick={() => {
            setIsFormOpen(true);
            setSelectedCategory(null);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>
        
        <Card className="p-4">
          <Tabs defaultValue="semua" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
              <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada kategori
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.id}</TableCell>
                        <TableCell>{category.nama}</TableCell>
                        <TableCell>
                          {category.jenis === "Pemasukan" ? (
                            <span className="flex items-center text-blue-600">
                              <FileUp className="h-3 w-3 mr-1" />
                              Pemasukan
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <FileDown className="h-3 w-3 mr-1" />
                              Pengeluaran
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {category.deskripsi || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeletePrompt(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </Card>
        
        {/* Category Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </DialogTitle>
            </DialogHeader>
            <KategoriForm
              initialData={selectedCategory || undefined}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus kategori ini?
                <br /><br />
                {selectedCategory && (
                  <>
                    <strong>ID:</strong> {selectedCategory.id}<br />
                    <strong>Nama:</strong> {selectedCategory.nama}<br />
                    <strong>Jenis:</strong> {selectedCategory.jenis}
                    <br /><br />
                  </>
                )}
                Kategori yang sudah digunakan dalam transaksi tetap akan tersimpan dalam data transaksi tersebut.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
