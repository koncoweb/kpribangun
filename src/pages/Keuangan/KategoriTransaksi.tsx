
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { type KategoriTransaksi as KategoriTransaksiType } from "@/types";
import {
  getAllKategoriTransaksi,
  createKategoriTransaksi,
  updateKategoriTransaksi,
  deleteKategoriTransaksi,
} from "@/services/keuanganService";

import KategoriForm from "@/components/keuangan/KategoriForm";
import { DeleteConfirmDialog } from "@/components/keuangan/DeleteConfirmDialog";

export default function KategoriTransaksi() {
  const [categories, setCategories] = useState<KategoriTransaksiType[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<KategoriTransaksiType[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<KategoriTransaksiType | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);
  
  // Filter categories when tab changes or search query updates
  useEffect(() => {
    filterCategories();
  }, [categories, activeTab, searchQuery]);
  
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
  
  // Filter categories based on active tab and search query
  const filterCategories = () => {
    let filtered = [...categories];
    
    // Filter by category type
    if (activeTab === "pemasukan") {
      filtered = filtered.filter(c => c.jenis === "Pemasukan");
    } else if (activeTab === "pengeluaran") {
      filtered = filtered.filter(c => c.jenis === "Pengeluaran");
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.nama.toLowerCase().includes(query) ||
        (c.deskripsi && c.deskripsi.toLowerCase().includes(query))
      );
    }
    
    setFilteredCategories(filtered);
  };
  
  // Handle category edit
  const handleEditCategory = (category: KategoriTransaksiType) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };
  
  // Handle category delete
  const handleDeletePrompt = (category: KategoriTransaksiType) => {
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
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Kategori Transaksi</h1>
          <Button onClick={() => {
            setIsFormOpen(true);
            setSelectedCategory(null);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Tabs 
                defaultValue="semua" 
                className="w-full sm:w-auto"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="semua">Semua</TabsTrigger>
                  <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
                  <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                </TabsList>
              </Tabs>
              
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
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Card key={category.id} className={
                category.jenis === "Pemasukan" ? "border-blue-200" : "border-red-200"
              }>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{category.nama}</CardTitle>
                      <p className={`text-sm font-medium ${
                        category.jenis === "Pemasukan" ? "text-blue-600" : "text-red-600"
                      }`}>
                        {category.jenis}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeletePrompt(category)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {category.deskripsi || "Tidak ada deskripsi"}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-10 text-center">
              <p className="text-gray-500">Tidak ada kategori yang ditemukan.</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => {
                  setIsFormOpen(true);
                  setSelectedCategory(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori Baru
              </Button>
            </div>
          )}
        </div>
        
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
