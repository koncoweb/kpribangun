
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Layout from "@/components/layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import {
  createTransaksi,
  getTransaksiById,
  getRemainingLoanAmount,
} from "@/services/transaksi";

const formSchema = z.object({
  jumlah: z.number().min(1, { message: "Jumlah harus diisi" }),
  keterangan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AngsuranForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const pinjamanId = location.state?.pinjamanId;

  const [loading, setLoading] = useState(true);
  const [pinjaman, setPinjaman] = useState<any>(null);
  const [sisaPinjaman, setSisaPinjaman] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jumlah: 0,
      keterangan: "",
    },
  });

  useEffect(() => {
    const fetchPinjaman = async () => {
      if (!pinjamanId) {
        toast({
          title: "Error",
          description: "ID pinjaman tidak ditemukan",
          variant: "destructive",
        });
        navigate("/transaksi/pinjam");
        return;
      }

      setLoading(true);
      try {
        const pinjamanData = await getTransaksiById(pinjamanId);
        if (!pinjamanData) {
          toast({
            title: "Error",
            description: "Data pinjaman tidak ditemukan",
            variant: "destructive",
          });
          navigate("/transaksi/pinjam");
          return;
        }

        setPinjaman(pinjamanData);

        // Get remaining loan amount
        const remaining = await getRemainingLoanAmount(pinjamanId);
        setSisaPinjaman(remaining);

        // Pre-fill form with remaining amount
        form.setValue("jumlah", remaining);
        form.setValue("keterangan", `Pembayaran angsuran untuk pinjaman #${pinjamanId}`);

      } catch (error) {
        console.error("Error fetching pinjaman:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data pinjaman",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPinjaman();
  }, [pinjamanId, navigate, toast, form]);

  const onSubmit = async (values: FormValues) => {
    if (values.jumlah > sisaPinjaman) {
      toast({
        title: "Peringatan",
        description: "Jumlah angsuran melebihi sisa pinjaman",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createTransaksi({
        anggotaId: pinjaman.anggotaId,
        jenis: "Angsuran",
        jumlah: values.jumlah,
        keterangan: values.keterangan || `Pembayaran angsuran untuk pinjaman #${pinjamanId}`,
        tanggal: new Date().toISOString().split("T")[0],
        status: "Sukses",
      });

      if (result) {
        toast({
          title: "Berhasil",
          description: "Angsuran berhasil ditambahkan",
        });
        navigate("/transaksi/pinjam");
      } else {
        toast({
          title: "Error",
          description: "Gagal menambahkan angsuran",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting angsuran:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan angsuran",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Form Angsuran">
        <div className="flex justify-center items-center h-64">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Form Angsuran">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pinjam">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Form Angsuran</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Pinjaman</CardTitle>
          <CardDescription>
            ID Pinjaman: {pinjaman?.id}
            <br />
            Nama Anggota: {pinjaman?.anggotaNama}
            <br />
            Jumlah Pinjaman: Rp {pinjaman?.jumlah.toLocaleString("id-ID")}
            <br />
            Sisa Pinjaman: Rp {sisaPinjaman.toLocaleString("id-ID")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jumlah"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Angsuran</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masukkan jumlah angsuran"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keterangan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Keterangan angsuran (opsional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0">
                <Button type="submit" className="w-full">
                  Simpan Angsuran
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}
