
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { login } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { adminLoginFormSchema } from "./formSchema";
import { DemoCredentialsSection } from "./DemoCredentialsSection";
import { LoginFooter } from "./LoginFooter";
import { UsernameInput } from "./UsernameInput";
import PasswordInput from "../anggota/PasswordInput";

import type { z } from "zod";

type FormData = z.infer<typeof adminLoginFormSchema>;

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  demoCredentials?: Array<{
    label: string;
    username: string;
    password: string;
  }>;
  onSuccessRedirect?: string;
}

export function LoginForm({
  title = "Koperasi Admin Panel",
  subtitle = "Masukkan username dan password untuk login",
  demoCredentials,
  onSuccessRedirect = "/"
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onDemoLogin = (username: string, password: string) => {
    form.setValue("username", username);
    form.setValue("password", password);
    form.handleSubmit(onSubmit)();
  };

  async function onSubmit(data: FormData) {
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <UsernameInput field={field} />
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

          {demoCredentials && (
            <DemoCredentialsSection 
              demoCredentials={demoCredentials}
              onDemoLogin={onDemoLogin}
            />
          )}
        </CardContent>
        <CardFooter>
          <LoginFooter 
            demoCredentials={demoCredentials}
            onDemoLogin={onDemoLogin}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
