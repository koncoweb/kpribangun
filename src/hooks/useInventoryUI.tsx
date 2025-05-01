
import { useState } from "react";
import { ProdukItem } from "@/types";

type ViewMode = "list" | "details" | "add" | "edit";

export function useInventoryUI(products: ProdukItem[]) {
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

  // Show stock adjustment dialog
  const handleShowStockDialog = (id: string) => {
    setSelectedProductId(id);
    setIsStockDialogOpen(true);
  };

  return {
    viewMode,
    selectedProductId,
    selectedProduct,
    isStockDialogOpen,
    isDeleteDialogOpen,
    setViewMode,
    setSelectedProductId,
    setIsStockDialogOpen,
    setIsDeleteDialogOpen,
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleShowStockDialog
  };
}
