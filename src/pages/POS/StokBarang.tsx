
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Plus } from "lucide-react";
import { ProdukItem } from "@/types";
import {
  getAllProdukItems,
  getProdukItemById,
  createProdukItem,
  updateProdukItem,
  deleteProdukItem,
  updateProdukStock,
  initSampleProdukData
} from "@/services/produkService";

// Import the new components
import { InventoryList } from "@/components/inventory/InventoryList";
import { ProductDetails } from "@/components/inventory/ProductDetails";
import { ProductForm } from "@/components/inventory/ProductForm";
import { StockAdjustmentDialog } from "@/components/inventory/StockAdjustmentDialog";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";

type ViewMode = "list" | "details" | "add" | "edit";

export default function StokBarang() {
  const { toast } = useToast();

  // States
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected product details
  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId) || null
    : null;

  // Load products on component mount
  useEffect(() => {
    initSampleProdukData(); // Initialize sample data if needed
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getAllProdukItems();
    setProducts(allProducts);
  };

  // View product details
  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
    setViewMode("details");
  };

  // Start edit product
  const handleEditProduct = (id: string) => {
    setSelectedProductId(id);
    setViewMode("edit");
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    setSelectedProductId(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!selectedProductId) return;
    
    setIsSubmitting(true);
    try {
      const result = deleteProdukItem(selectedProductId);
      if (result) {
        toast({
          title: "Produk berhasil dihapus",
          description: "Produk telah dihapus dari inventori",
        });
        loadProducts();
        setIsDeleteDialogOpen(false);
        setViewMode("list");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show stock adjustment dialog
  const handleShowStockDialog = (id: string) => {
    setSelectedProductId(id);
    setIsStockDialogOpen(true);
  };

  // Handle stock adjustment
  const handleAdjustStock = async (quantity: number) => {
    if (!selectedProductId) return;
    
    setIsSubmitting(true);
    try {
      const result = updateProdukStock(selectedProductId, quantity);
      if (result) {
        toast({
          title: "Stok berhasil disesuaikan",
          description: `Stok produk telah ${quantity > 0 ? "ditambahkan" : "dikurangi"}`,
        });
        loadProducts();
        setIsStockDialogOpen(false);
      } else {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      toast({
        title: "Gagal menyesuaikan stok",
        description: "Terjadi kesalahan saat memperbarui stok",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add or update product
  const handleSubmitProduct = async (productData: Omit<ProdukItem, "id" | "createdAt">) => {
    setIsSubmitting(true);
    try {
      if (viewMode === "add") {
        // Add new product
        const newProduct = createProdukItem(productData);
        if (newProduct) {
          toast({
            title: "Produk berhasil ditambahkan",
            description: "Produk baru telah ditambahkan ke inventori",
          });
          loadProducts();
          setViewMode("list");
        }
      } else if (viewMode === "edit" && selectedProductId) {
        // Update existing product
        const updatedProduct = updateProdukItem(selectedProductId, productData);
        if (updatedProduct) {
          toast({
            title: "Produk berhasil diperbarui",
            description: "Informasi produk telah diperbarui",
          });
          loadProducts();
          setViewMode("list");
        }
      }
    } catch (error) {
      toast({
        title: "Gagal menyimpan produk",
        description: "Terjadi kesalahan saat menyimpan data produk",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render functions based on view mode
  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>Manajemen Stok Barang</CardTitle>
                </div>
                <Button onClick={() => setViewMode("add")}>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Produk
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Belum ada produk. Klik tombol 'Tambah Produk' untuk menambahkan produk baru.
                  </AlertDescription>
                </Alert>
              ) : (
                <InventoryList
                  products={products}
                  onViewItem={handleViewProduct}
                  onEditItem={handleEditProduct}
                  onDeleteItem={handleDeleteProduct}
                />
              )}
            </CardContent>
          </Card>
        );
        
      case "details":
        return selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onEdit={() => setViewMode("edit")}
            onBack={() => setViewMode("list")}
          />
        ) : (
          <Card>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Produk tidak ditemukan. Kembali ke daftar produk.
                </AlertDescription>
              </Alert>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => setViewMode("list")}
              >
                Kembali ke Daftar
              </Button>
            </CardContent>
          </Card>
        );
        
      case "add":
        return (
          <ProductForm
            isEditing={false}
            onSubmit={handleSubmitProduct}
            onCancel={() => setViewMode("list")}
            isSubmitting={isSubmitting}
          />
        );
        
      case "edit":
        return selectedProduct ? (
          <ProductForm
            initialData={selectedProduct}
            isEditing={true}
            onSubmit={handleSubmitProduct}
            onCancel={() => setViewMode("list")}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Card>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Produk tidak ditemukan. Kembali ke daftar produk.
                </AlertDescription>
              </Alert>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => setViewMode("list")}
              >
                Kembali ke Daftar
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <Layout pageTitle="Stok Barang">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Stok Barang</h2>
        </div>
        
        {renderContent()}
        
        {/* Dialogs */}
        {selectedProduct && (
          <>
            <StockAdjustmentDialog
              open={isStockDialogOpen}
              onOpenChange={setIsStockDialogOpen}
              productName={selectedProduct.nama}
              currentStock={selectedProduct.stok}
              onAdjustStock={handleAdjustStock}
              isSubmitting={isSubmitting}
            />
            
            <DeleteConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              productName={selectedProduct.nama}
              onConfirm={confirmDeleteProduct}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
