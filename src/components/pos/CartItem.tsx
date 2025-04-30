
import { ProdukItem, PenjualanItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"; // Added ShoppingCart import
import { useState, useEffect } from "react";

interface CartItemProps {
  item: PenjualanItem;
  product: ProdukItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, product, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.jumlah);
  
  useEffect(() => {
    setQuantity(item.jumlah);
  }, [item.jumlah]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= 0 && newValue <= product.stok) {
      setQuantity(newValue);
      onUpdateQuantity(product.id, newValue);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stok) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(product.id, newQuantity);
    } else {
      onRemove(product.id);
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b">
      <div className="h-14 w-14 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
        {product.gambar ? (
          <img
            src={product.gambar}
            alt={product.nama}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ShoppingCart className="h-6 w-6 text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1">{product.nama}</h4>
        <p className="text-xs text-gray-500">
          {formatRupiah(product.hargaJual)} / {product.satuan}
        </p>
      </div>

      <div className="flex items-center">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-r-none"
          onClick={decreaseQuantity}
        >
          {quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </Button>
        
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="h-8 w-12 px-0 text-center text-sm rounded-none"
          min={1}
          max={product.stok}
        />
        
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-l-none"
          onClick={increaseQuantity}
          disabled={quantity >= product.stok}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-24 text-right">
        <p className="font-medium text-sm">{formatRupiah(item.total)}</p>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 text-destructive hover:text-destructive"
        onClick={() => onRemove(product.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
