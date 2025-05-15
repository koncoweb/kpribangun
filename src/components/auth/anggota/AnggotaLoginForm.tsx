
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import PasswordInput from "./PasswordInput";
import { toast } from "@/hooks/use-toast";
import { anggotaLoginSchema } from "./formSchema";
import { loginAsAnggota } from "@/services/authService";

type AnggotaLoginFormValues = z.infer<typeof anggotaLoginSchema>;

export function AnggotaLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<AnggotaLoginFormValues>({
    resolver: zodResolver(anggotaLoginSchema),
    defaultValues: {
      anggotaId: "",
      password: ""
    }
  });
  
  async function onSubmit(values: AnggotaLoginFormValues) {
    setIsLoading(true);
    
    try {
      const result = await loginAsAnggota(values.anggotaId, values.password);
      
      if (result.success) {
        toast({
          title: "Login berhasil!",
          description: `Selamat datang kembali, ${result.nama}`,
        });
        navigate("/anggota/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login gagal",
          description: result.message || "ID Anggota atau kata sandi salah."
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat login. Silakan coba lagi."
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login Anggota</CardTitle>
          <CardDescription className="text-center">
            Masukkan ID Anggota dan kata sandi Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="anggotaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Anggota</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan ID Anggota" {...field} />
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
                    <FormLabel>Kata Sandi</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Masukkan kata sandi" {...field} />
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
                    Login
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-gray-600 mt-4">
            Belum memiliki akun? Hubungi admin untuk pendaftaran.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
