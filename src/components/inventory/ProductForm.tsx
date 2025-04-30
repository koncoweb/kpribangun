
import React from "react";
import { ProdukItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductFormProps {
  initialData?: Partial<ProdukItem>;
  isEditing: boolean;
  onSubmit: (data: Omit<ProdukItem, "id" | "createdAt">) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProductForm({
  initialData,
  isEditing,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const [formData, setFormData] = React.useState<Omit<ProdukItem, "id" | "createdAt">>({
    kode: initialData?.kode || "",
    nama: initialData?.nama || "",
    kategori: initialData?.kategori || "",
    hargaBeli: initialData?.hargaBeli || 0,
    hargaJual: initialData?.hargaJual || 0,
    stok: initialData?.stok || 0,
    satuan: initialData?.satuan || "pcs",
    deskripsi: initialData?.deskripsi || "",
    gambar: initialData?.gambar || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === "hargaBeli" || name === "hargaJual" || name === "stok"
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Produk" : "Tambah Produk Baru"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Perbarui informasi produk yang sudah ada"
              : "Isi informasi untuk menambahkan produk baru ke inventori"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kode">Kode Produk</Label>
              <Input
                id="kode"
                name="kode"
                value={formData.kode}
                onChange={handleChange}
                placeholder="Masukkan kode produk"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Produk</Label>
              <Input
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama produk"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                placeholder="Masukkan kategori"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="satuan">Satuan</Label>
              <Input
                id="satuan"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                placeholder="Masukkan satuan (pcs, kg, dll)"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hargaBeli">Harga Beli (Rp)</Label>
              <Input
                id="hargaBeli"
                name="hargaBeli"
                type="number"
                value={formData.hargaBeli}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hargaJual">Harga Jual (Rp)</Label>
              <Input
                id="hargaJual"
                name="hargaJual"
                type="number"
                value={formData.hargaJual}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stok">Stok</Label>
              <Input
                id="stok"
                name="stok"
                type="number"
                value={formData.stok}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi produk"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : isEditing
              ? "Perbarui Produk"
              : "Tambah Produk"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
