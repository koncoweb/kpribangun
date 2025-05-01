
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, Key, Shield } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginUser } from "@/services/authService";

// Create schema for form validation
const formSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const user = await loginUser(values.username, values.password);
      
      if (user) {
        toast({
          title: "Login berhasil",
          description: `Selamat datang, ${user.nama}`,
        });
        
        // Redirect based on user role
        if (user.roleId === 'role_superadmin') {
          navigate('/');
        } else if (user.roleId === 'role_admin') {
          navigate('/');
        } else {
          navigate(`/anggota/${user.anggotaId}`);
        }
      }
    } catch (error) {
      toast({
        title: "Login gagal",
        description: "Username atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle demo login
  const handleDemoLogin = (role: "superadmin" | "admin" | "anggota") => {
    let username = "";
    let password = "password123"; // Using a common password for demo
    
    switch(role) {
      case "superadmin":
        username = "superadmin";
        break;
      case "admin":
        username = "admin";
        break;
      case "anggota":
        username = "anggota1";
        break;
    }
    
    form.setValue("username", username);
    form.setValue("password", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            DEMO KPRI BANGUN
          </CardTitle>
          <CardDescription>
            Masukkan kredensial untuk melanjutkan
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Masukkan username"
                          className="pl-10"
                          {...field}
                        />
                      </div>
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
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan password"
                          className="pl-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2 pt-0">
          <div className="relative w-full my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Demo Login
              </span>
            </div>
          </div>
          
          <div className="grid w-full grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleDemoLogin("superadmin")}
              className="text-xs h-auto py-1"
            >
              <Shield className="mr-1 h-3 w-3" /> Super Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleDemoLogin("admin")}
              className="text-xs h-auto py-1"
            >
              <User className="mr-1 h-3 w-3" /> Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleDemoLogin("anggota")}
              className="text-xs h-auto py-1"
            >
              <User className="mr-1 h-3 w-3" /> Anggota
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            Sistem Koperasi Pegawai Republik Indonesia
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
