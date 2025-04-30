
import { ProdukItem } from "@/types";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Plus } from "lucide-react";

interface ProductCardProps {
  product: ProdukItem;
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.gambar ? (
          <img
            src={product.gambar}
            alt={product.nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ShoppingCart className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {product.stok <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-1">{product.nama}</h3>
        <p className="text-xs text-gray-500 mb-1">{product.kategori}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm font-bold text-primary">
              {formatRupiah(product.hargaJual)}
            </p>
            <p className="text-xs text-gray-500">
              Stok: {product.stok} {product.satuan}
            </p>
          </div>
          
          <Button
            size="sm"
            variant={product.stok > 0 ? "default" : "outline"}
            className="h-8 w-8 p-0"
            disabled={product.stok <= 0}
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
