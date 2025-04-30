
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { ProdukItem, PenjualanItem } from "@/types";
import { Kasir } from "@/types";
import { getProdukItemById } from "@/services/produkService";
import { calculateTotal } from "@/services/penjualanService";

interface CartSectionProps {
  items: PenjualanItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCheckout: (checkoutData: {
    kasirId: string;
    metodePembayaran: "cash" | "debit" | "kredit" | "qris";
    dibayar: number;
    kembalian: number;
    catatan: string;
  }) => void;
  kasirList: Kasir[];
  processing: boolean;
}

// Helper component for labels
function Label({ htmlFor, children }: { htmlFor?: string, children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
      {children}
    </label>
  );
}

export function CartSection({ 
  items, 
  onUpdateQuantity, 
  onRemove, 
  onClear, 
  onCheckout,
  kasirList,
  processing
}: CartSectionProps) {
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  
  const subtotal = items.reduce((total, item) => total + item.total, 0);
  const total = calculateTotal(items, discount, tax).total;
  
  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="text-lg font-medium">Keranjang</h2>
          {items.length > 0 && (
            <Badge variant="secondary">
              {items.reduce((sum, item) => sum + item.jumlah, 0)}
            </Badge>
          )}
        </div>
        
        {items.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClear}
          >
            Kosongkan
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Keranjang belanja kosong</p>
          </div>
        ) : (
          <div className="p-4">
            {items.map(item => {
              const product = getProdukItemById(item.produkId);
              if (!product) return null;
              
              return (
                <CartItem 
                  key={item.produkId}
                  item={item}
                  product={product}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
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
              items={items}
              subtotal={subtotal}
              tax={tax}
              discount={discount}
              total={total}
              onCheckout={onCheckout}
              kasirList={kasirList}
              processing={processing}
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
  );
}
