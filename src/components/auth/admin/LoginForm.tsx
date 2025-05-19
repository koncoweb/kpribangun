
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { login } from "@/services/auth";
import { toast } from "@/hooks/use-toast";
import { FormData, LoginFormProps } from "./types";
import LoginFormFields from "./LoginFormFields";

export function LoginForm({
  title = "Koperasi Admin Panel",
  subtitle = "Masukkan email dan password untuk login",
  onSuccessRedirect = "/"
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormData>({
    username: "",
    password: ""
  });

  async function handleSubmit(data: FormData) {
    setIsLoading(true);
    
    try {
      // With Supabase Auth, we use email for authentication
      // We're using the username field from the form as the email
      const email = data.username;
      const result = await login(email, data.password);
      
      if (result.success) {
        toast({
          title: "Login berhasil!",
          description: `Selamat datang kembali, ${result.user?.nama || result.user?.email}`,
        });
        navigate(onSuccessRedirect);
      } else {
        toast({
          variant: "destructive",
          title: "Login gagal",
          description: result.message || "Email atau password salah.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Terjadi kesalahan saat login. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginFormFields 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            defaultValues={formValues}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-center text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Daftar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
