
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { login } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { LoginFooter } from "./LoginFooter";
import { FormData, LoginFormProps } from "./types";
import LoginFormFields from "./LoginFormFields";
import InitializeDataButton from "./InitializeDataButton";
import DemoLoginButton from "./DemoLoginButton";

export function LoginForm({
  title = "Koperasi Admin Panel",
  subtitle = "Masukkan username dan password untuk login",
  demoCredentials,
  onSuccessRedirect = "/"
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormData>({
    username: "",
    password: ""
  });

  const onDemoLogin = (username: string, password: string) => {
    setFormValues({
      username,
      password,
    });
    handleSubmit({
      username,
      password,
    });
  };

  async function handleSubmit(data: FormData) {
    setIsLoading(true);
    
    try {
      const result = await login(data.username, data.password);
      
      if (result.success) {
        toast({
          title: "Login berhasil!",
          description: `Selamat datang kembali, ${result.user?.nama}`,
        });
        navigate(onSuccessRedirect);
      } else {
        toast({
          variant: "destructive",
          title: "Login gagal",
          description: result.message || "Username atau password salah.",
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

          <InitializeDataButton />

          {/* Single Demo Access button (only show if demoCredentials are provided) */}
          {demoCredentials && demoCredentials.length > 0 && (
            <DemoLoginButton onDemoLogin={onDemoLogin} />
          )}
        </CardContent>
        <CardFooter>
          <LoginFooter 
            onDemoLogin={onDemoLogin}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
