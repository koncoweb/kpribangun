
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInventory } from "@/hooks/useInventory";

// Import the components
import { InventoryView } from "@/components/inventory/InventoryView";
import { ProductDetails } from "@/components/inventory/ProductDetails";
import { ProductForm } from "@/components/inventory/ProductForm";
import { StockAdjustmentDialog } from "@/components/inventory/StockAdjustmentDialog";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";
import { ProductNotFound } from "@/components/inventory/ProductNotFound";

type ViewMode = "list" | "details" | "add" | "edit";

export default function StokBarang() {
  // Custom hook for inventory management
  const { 
    products, 
    isSubmitting, 
    handleSubmitProduct, 
    confirmDeleteProduct,
    handleAdjustStock 
  } = useInventory();

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get selected product details
  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId) || null
    : null;

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
  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;
    
    const success = await confirmDeleteProduct(selectedProductId);
    if (success) {
      setIsDeleteDialogOpen(false);
      setViewMode("list");
    }
  };

  // Show stock adjustment dialog
  const handleShowStockDialog = (id: string) => {
    setSelectedProductId(id);
    setIsStockDialogOpen(true);
  };

  // Handle stock adjustment
  const handleStockAdjustment = async (quantity: number) => {
    if (!selectedProductId) return;
    
    const success = await handleAdjustStock(selectedProductId, quantity);
    if (success) {
      setIsStockDialogOpen(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (productData: Omit<ProdukItem, "id" | "createdAt">) => {
    const isEditing = viewMode === "edit";
    const success = await handleSubmitProduct(productData, isEditing, selectedProductId || undefined);
    
    if (success) {
      setViewMode("list");
    }
  };

  // Render functions based on view mode
  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <InventoryView 
            products={products}
            onViewItem={handleViewProduct}
            onEditItem={handleEditProduct}
            onDeleteItem={handleDeleteProduct}
            onAddItem={() => setViewMode("add")}
          />
        );
        
      case "details":
        return selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onEdit={() => setViewMode("edit")}
            onBack={() => setViewMode("list")}
            onAdjustStock={handleShowStockDialog}
          />
        ) : (
          <ProductNotFound onBack={() => setViewMode("list")} />
        );
        
      case "add":
        return (
          <ProductForm
            isEditing={false}
            onSubmit={handleFormSubmit}
            onCancel={() => setViewMode("list")}
            isSubmitting={isSubmitting}
          />
        );
        
      case "edit":
        return selectedProduct ? (
          <ProductForm
            initialData={selectedProduct}
            isEditing={true}
            onSubmit={handleFormSubmit}
            onCancel={() => setViewMode("list")}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ProductNotFound onBack={() => setViewMode("list")} />
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
              onAdjustStock={handleStockAdjustment}
              isSubmitting={isSubmitting}
            />
            
            <DeleteConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              productName={selectedProduct.nama}
              onConfirm={handleConfirmDelete}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
