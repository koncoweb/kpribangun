import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { PenjualanItem } from "@/types";
import { Kasir } from "@/types";
import { getProdukItemById } from "@/services/produk";
import { calculateTotal } from "@/services/penjualan";
import { CartHeader } from "./cart/CartHeader";
import { EmptyCart } from "./cart/EmptyCart";
import { DiscountTaxInputs } from "./cart/DiscountTaxInputs";

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
  const itemCount = items.reduce((sum, item) => sum + item.jumlah, 0);
  
  return (
    <div className="bg-white rounded-lg border shadow-sm h-full flex flex-col">
      <CartHeader itemCount={itemCount} onClear={onClear} />
      
      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <EmptyCart />
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
            <DiscountTaxInputs
              discount={discount}
              tax={tax}
              onDiscountChange={setDiscount}
              onTaxChange={setTax}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
