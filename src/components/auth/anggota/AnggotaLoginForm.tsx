
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from './PasswordInput';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from './formSchema';
import { loginWithAnggotaId } from '@/services/authService';
import { useToast } from '@/components/ui/use-toast';

type FormData = z.infer<typeof formSchema>;

export function AnggotaLoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      anggotaId: '',
      password: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await loginWithAnggotaId(data.anggotaId, data.password);
      toast({
        title: "Login Berhasil",
        description: "Anda akan dialihkan ke halaman utama",
      });
      navigate('/anggota');
    } catch (error: any) {
      toast({
        title: "Login Gagal",
        description: error.message || "Terjadi kesalahan saat login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Koperasi Simpan Pinjam</CardTitle>
          <CardDescription>Login Anggota</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="anggotaId">ID Anggota</Label>
              <Input
                id="anggotaId"
                placeholder="Masukkan ID Anggota"
                {...register('anggotaId')}
                disabled={loading}
              />
              {errors.anggotaId?.message && (
                <p className="text-sm text-red-500">{errors.anggotaId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                name="password"
                id="password"
                placeholder="Masukkan password"
                {...register('password')}
                disabled={loading}
              />
              {errors.password?.message && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Login'}
            </Button>

            <div className="text-center text-sm">
              <Button variant="link" onClick={() => navigate('/login')} disabled={loading}>
                Login sebagai Admin
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
