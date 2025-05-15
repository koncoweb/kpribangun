import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordInput from "./PasswordInput";
import { toast } from "@/components/ui/use-toast";
import { anggotaLoginSchema } from "./formSchema";
import { Link } from "react-router-dom";
import { loginAsAnggota } from "@/services/authService";
import type { z } from "zod";

type FormData = z.infer<typeof anggotaLoginSchema>;

export function AnggotaLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(anggotaLoginSchema),
    defaultValues: {
      anggotaId: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    
    try {
      const result = await loginAsAnggota(data.anggotaId, data.password);
      
      if (result.success) {
        toast({
          title: "Login berhasil!",
          description: `Selamat datang, ${result.user?.nama}`,
        });
        navigate("/anggota");
      } else {
        toast({
          variant: "destructive",
          title: "Login gagal",
          description: result.message || "ID Anggota atau password salah",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">KPRI BANGUN</CardTitle>
          <CardDescription className="text-center">
            Login Anggota
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="anggotaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Anggota</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan ID Anggota Anda"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Masukkan password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span>Memproses...</span>
                ) : (
                  <>
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Login sebagai Admin
            </Link>
            <p className="text-xs text-muted-foreground">
              KPRI Bangun &copy; 2023 - All rights reserved
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
