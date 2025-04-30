
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { ProductSection } from "@/components/pos/ProductSection";
import { CartSection } from "@/components/pos/CartSection";
import { SuccessDialog } from "@/components/pos/SuccessDialog";
import { ProdukItem, PenjualanItem, type Penjualan as PenjualanType } from "@/types";
import { getAllProdukItems, getProdukItemById, initSampleProdukData } from "@/services/produkService";
import { getAllKasir, initSampleKasirData } from "@/services/kasirService";
import { createPenjualan, calculateTotal } from "@/services/penjualanService";

export default function Penjualan() {
  const { toast } = useToast();
  
  // States
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [cartItems, setCartItems] = useState<PenjualanItem[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [completedSale, setCompletedSale] = useState<PenjualanType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Load initial data
  useEffect(() => {
    initSampleProdukData();
    initSampleKasirData();
    
    const products = getAllProdukItems();
    setProducts(products);
  }, []);
  
  // Add to cart
  const handleAddToCart = (product: ProdukItem) => {
    if (product.stok <= 0) {
      toast({
        title: "Stok habis",
        description: `${product.nama} tidak memiliki stok yang cukup`,
        variant: "destructive"
      });
      return;
    }
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.produkId === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const newItems = [...prevItems];
        const existingItem = newItems[existingItemIndex];
        
        if (existingItem.jumlah < product.stok) {
          newItems[existingItemIndex] = {
            ...existingItem,
            jumlah: existingItem.jumlah + 1,
            total: (existingItem.jumlah + 1) * existingItem.hargaSatuan
          };
          return newItems;
        }
        
        toast({
          title: "Stok tidak cukup",
          description: `Stok ${product.nama} hanya tersisa ${product.stok} ${product.satuan}`,
          variant: "destructive"
        });
        return prevItems;
      }
      
      // Add new item
      return [...prevItems, {
        produkId: product.id,
        jumlah: 1,
        hargaSatuan: product.hargaJual,
        total: product.hargaJual
      }];
    });
  };
  
  // Update cart quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const product = getProdukItemById(productId);
    
    if (!product) return;
    
    if (quantity > product.stok) {
      toast({
        title: "Stok tidak cukup",
        description: `Stok ${product.nama} hanya tersisa ${product.stok} ${product.satuan}`,
        variant: "destructive"
      });
      return;
    }
    
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.produkId === productId) {
          return {
            ...item,
            jumlah: quantity,
            total: quantity * item.hargaSatuan
          };
        }
        return item;
      });
    });
  };
  
  // Remove from cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.produkId !== productId));
  };
  
  // Clear cart
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    setCartItems([]);
    toast({
      title: "Keranjang dikosongkan",
      description: "Semua item telah dihapus dari keranjang"
    });
  };
  
  // Handle checkout
  const handleCheckout = (checkoutData: {
    kasirId: string;
    metodePembayaran: "cash" | "debit" | "kredit" | "qris";
    dibayar: number;
    kembalian: number;
    catatan: string;
  }) => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        // Calculate totals
        const { subtotal, total } = calculateTotal(cartItems);
        
        // Create sale
        const newSale = createPenjualan({
          tanggal: new Date().toISOString(),
          kasirId: checkoutData.kasirId,
          items: cartItems,
          subtotal,
          diskon: 0,
          pajak: 0,
          total,
          dibayar: checkoutData.dibayar,
          kembalian: checkoutData.kembalian,
          metodePembayaran: checkoutData.metodePembayaran,
          status: "sukses",
          catatan: checkoutData.catatan
        });
        
        setCompletedSale(newSale);
        setShowSuccessDialog(true);
        
        // Reset cart
        setCartItems([]);
        
        // Refresh products to update stock
        setProducts(getAllProdukItems());
      } catch (error) {
        toast({
          title: "Gagal memproses pembayaran",
          description: "Terjadi kesalahan saat memproses pembayaran",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1500); // Simulate processing delay
  };
  
  return (
    <Layout pageTitle="Penjualan">
      <h1 className="page-title">Penjualan</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <ProductSection 
            products={products}
            onAddToCart={handleAddToCart}
          />
        </div>
        
        {/* Cart Section */}
        <div className="lg:col-span-1">
          <CartSection
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onClear={handleClearCart}
            onCheckout={handleCheckout}
            kasirList={getAllKasir()}
            processing={isProcessing}
          />
        </div>
      </div>
      
      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        sale={completedSale}
      />
    </Layout>
  );
}
