
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, ShoppingCart, Receipt, Check } from "lucide-react";
import { ProductCard } from "@/components/pos/ProductCard";
import { CartItem } from "@/components/pos/CartItem";
import { CartSummary } from "@/components/pos/CartSummary";
import { ProdukItem, PenjualanItem, Penjualan } from "@/types";
import { getAllProdukItems, getProdukItemById, initSampleProdukData } from "@/services/produkService";
import { getAllKasir, initSampleKasirData } from "@/services/kasirService";
import { createPenjualan, calculateTotal } from "@/services/penjualanService";
import { formatRupiah } from "@/lib/utils";

export default function Penjualan() {
  const { toast } = useToast();
  
  // States
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [cartItems, setCartItems] = useState<PenjualanItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [completedSale, setCompletedSale] = useState<Penjualan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Cart totals
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const subtotal = cartItems.reduce((total, item) => total + item.total, 0);
  const total = calculateTotal(cartItems, discount, tax).total;
  
  // Load initial data
  useEffect(() => {
    initSampleProdukData();
    initSampleKasirData();
    
    const products = getAllProdukItems();
    setProducts(products);
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(products.map(p => p.kategori)));
    setCategories(uniqueCategories);
  }, []);
  
  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "" || product.kategori === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
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
        // Create sale
        const newSale = createPenjualan({
          tanggal: new Date().toISOString(),
          kasirId: checkoutData.kasirId,
          items: cartItems,
          subtotal,
          diskon: discount,
          pajak: tax,
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
        setDiscount(0);
        setTax(0);
        
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
  
  // Clear cart
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    setCartItems([]);
    toast({
      title: "Keranjang dikosongkan",
      description: "Semua item telah dihapus dari keranjang"
    });
  };
  
  return (
    <Layout pageTitle="Penjualan">
      <h1 className="page-title">Penjualan</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 relative min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Cari produk..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua Kategori</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Cart Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h2 className="text-lg font-medium">Keranjang</h2>
                {cartItems.length > 0 && (
                  <Badge variant="secondary">
                    {cartItems.reduce((sum, item) => sum + item.jumlah, 0)}
                  </Badge>
                )}
              </div>
              
              {cartItems.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearCart}
                >
                  Kosongkan
                </Button>
              )}
            </div>
            
            <div className="flex-1 overflow-auto">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500">Keranjang belanja kosong</p>
                </div>
              ) : (
                <div className="p-4">
                  {cartItems.map(item => {
                    const product = getProdukItemById(item.produkId);
                    if (!product) return null;
                    
                    return (
                      <CartItem 
                        key={item.produkId}
                        item={item}
                        product={product}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveFromCart}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <Tabs defaultValue="pembayaran">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="pembayaran" className="flex-1">Pembayaran</TabsTrigger>
                  <TabsTrigger value="diskon" className="flex-1">Diskon & Pajak</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pembayaran">
                  <CartSummary
                    items={cartItems}
                    subtotal={subtotal}
                    tax={tax}
                    discount={discount}
                    total={total}
                    onCheckout={handleCheckout}
                    kasirList={getAllKasir()}
                    processing={isProcessing}
                  />
                </TabsContent>
                
                <TabsContent value="diskon">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="discount">Diskon (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tax">Pajak (%)</Label>
                      <Input
                        id="tax"
                        type="number"
                        min="0"
                        max="100"
                        value={tax}
                        onChange={(e) => setTax(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" /> Pembayaran Berhasil
            </DialogTitle>
          </DialogHeader>
          
          {completedSale && (
            <div className="space-y-4">
              <div className="py-3 rounded-lg bg-muted">
                <div className="flex justify-center">
                  <Receipt className="h-10 w-10 text-primary" />
                </div>
                <p className="text-center font-bold mt-2">{completedSale.nomorTransaksi}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Pembayaran</span>
                  <span className="font-bold">{formatRupiah(completedSale.total)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran</span>
                  <span>
                    {completedSale.metodePembayaran === "cash" ? "Tunai" : 
                     completedSale.metodePembayaran === "debit" ? "Debit" :
                     completedSale.metodePembayaran === "kredit" ? "Kartu Kredit" : "QRIS"}
                  </span>
                </div>
                
                {completedSale.metodePembayaran === "cash" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dibayar</span>
                      <span>{formatRupiah(completedSale.dibayar)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kembalian</span>
                      <span>{formatRupiah(completedSale.kembalian)}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="pt-3 border-t">
                <p className="text-center text-muted-foreground text-sm">
                  Transaksi telah disimpan dan stok telah diperbarui
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              className="w-full" 
              onClick={() => setShowSuccessDialog(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// Helper component for labels
function Label({ htmlFor, children }: { htmlFor?: string, children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
      {children}
    </label>
  );
}
