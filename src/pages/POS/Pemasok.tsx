
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash, Plus, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { Pemasok } from "@/types";
import {
  getAllPemasok,
  getPemasokById,
  createPemasok, 
  updatePemasok, 
  deletePemasok 
} from "@/services/pemasokService";

export default function PemasokPage() {
  const [pemasokList, setPemasokList] = useState<Pemasok[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPemasok, setCurrentPemasok] = useState<Pemasok | null>(null);
  const [selectedPemasokId, setSelectedPemasokId] = useState<string | null>(null);

  // Form schema
  const pemasokSchema = z.object({
    nama: z.string().min(3, "Nama pemasok harus diisi minimal 3 karakter"),
    alamat: z.string().min(5, "Alamat harus diisi minimal 5 karakter"),
    telepon: z.string().min(5, "Nomor telepon harus diisi"),
    email: z.string().email("Format email tidak valid"),
    kontak: z.string().min(3, "Nama kontak harus diisi")
  });

  const form = useForm<z.infer<typeof pemasokSchema>>({
    resolver: zodResolver(pemasokSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      telepon: "",
      email: "",
      kontak: ""
    }
  });

  useEffect(() => {
    loadPemasok();
  }, []);

  const loadPemasok = () => {
    setPemasokList(getAllPemasok());
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPemasok = pemasokList.filter(item => 
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kontak.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openNewForm = () => {
    form.reset({
      nama: "",
      alamat: "",
      telepon: "",
      email: "",
      kontak: ""
    });
    setCurrentPemasok(null);
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const pemasok = pemasokList.find(item => item.id === id);
    if (pemasok) {
      form.reset({
        nama: pemasok.nama,
        alamat: pemasok.alamat,
        telepon: pemasok.telepon,
        email: pemasok.email,
        kontak: pemasok.kontak
      });
      setCurrentPemasok(pemasok);
      setIsFormOpen(true);
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedPemasokId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedPemasokId) {
      const result = deletePemasok(selectedPemasokId);
      if (result) {
        toast.success("Pemasok berhasil dihapus");
        loadPemasok();
      } else {
        toast.error("Pemasok tidak dapat dihapus karena digunakan dalam transaksi");
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const onSubmit = (values: z.infer<typeof pemasokSchema>) => {
    if (currentPemasok) {
      // Update existing supplier
      const updatedPemasok = updatePemasok(currentPemasok.id, values);
      if (updatedPemasok) {
        toast.success("Data pemasok berhasil diperbarui");
        loadPemasok();
        setIsFormOpen(false);
      } else {
        toast.error("Gagal memperbarui data pemasok");
      }
    } else {
      // Create new supplier
      createPemasok(values);
      toast.success("Pemasok baru berhasil ditambahkan");
      loadPemasok();
      setIsFormOpen(false);
    }
  };

  return (
    <Layout pageTitle="Data Pemasok">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Data Pemasok / Supplier</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewForm}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pemasok
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>
                {currentPemasok ? "Edit Pemasok" : "Tambah Pemasok Baru"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Pemasok</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama perusahaan/toko pemasok" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Alamat lengkap pemasok" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telepon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="Nomor telepon" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email pemasok" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="kontak"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kontak Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama orang yang dapat dihubungi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-3">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit">
                    {currentPemasok ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemasok</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Cari pemasok..."
              value={searchQuery}
              onChange={handleSearch}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pemasok</TableHead>
                  <TableHead>Kontak Person</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead className="w-[120px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPemasok.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Tidak ada data pemasok
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPemasok.map((pemasok) => (
                    <TableRow key={pemasok.id}>
                      <TableCell className="font-medium">{pemasok.nama}</TableCell>
                      <TableCell>{pemasok.kontak}</TableCell>
                      <TableCell>{pemasok.telepon}</TableCell>
                      <TableCell>{pemasok.email}</TableCell>
                      <TableCell className="truncate max-w-[200px]">{pemasok.alamat}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditForm(pemasok.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-destructive" onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(pemasok.id);
                              }}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus pemasok ini? Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}
