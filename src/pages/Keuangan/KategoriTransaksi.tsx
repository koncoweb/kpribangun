
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { KategoriTransaksi } from "@/types";
import {
  getAllKategoriTransaksi,
  deleteKategoriTransaksi,
} from "@/services/keuanganService";
import KategoriForm from "@/components/keuangan/KategoriForm";
import { DeleteConfirmDialog } from "@/components/keuangan/DeleteConfirmDialog";

export default function KategoriTransaksi() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<KategoriTransaksi[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<KategoriTransaksi[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KategoriTransaksi | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);
  
  // Filter categories when search query updates
  useEffect(() => {
    filterCategories();
  }, [categories, searchQuery]);
  
  // Load all categories
  const loadCategories = () => {
    try {
      const data = getAllKategoriTransaksi();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast.error("Gagal memuat data kategori");
    }
  };
  
  // Filter categories based on search query
  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = categories.filter(category => 
      category.nama.toLowerCase().includes(query) ||
      (category.deskripsi && category.deskripsi.toLowerCase().includes(query))
    );
    
    setFilteredCategories(filtered);
  };
  
  // Handle category edit
  const handleEditCategory = (category: KategoriTransaksi) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };
  
  // Handle category delete
  const handleDeletePrompt = (category: KategoriTransaksi) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };
  
  // Confirm category delete
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
  
  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  // Form success handler
  const handleFormSuccess = () => {
    loadCategories();
    setIsFormOpen(false);
    setSelectedCategory(null);
  };
  
  return (
    <Layout pageTitle="Kategori Transaksi">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Kategori Transaksi</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/keuangan/transaksi")}>
              Transaksi
            </Button>
            <Button onClick={() => {
              setIsFormOpen(true);
              setSelectedCategory(null);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kategori..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Tidak ada kategori yang ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.nama}</TableCell>
                        <TableCell>{category.deskripsi || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              category.jenis === "Pemasukan"
                                ? "border-blue-500 text-blue-500"
                                : "border-red-500 text-red-500"
                            }`}
                          >
                            {category.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600"
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
          </CardContent>
        </Card>

        {/* Category Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-lg">
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
        <DeleteConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
          itemName={selectedCategory?.nama}
          itemType="kategori"
        />
      </div>
    </Layout>
  );
}
