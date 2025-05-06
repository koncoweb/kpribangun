
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Key, Eye, EyeOff, ShieldCheck } from "lucide-react";

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

interface LoginFormProps {
  title?: string;
  subtitle?: string;
  onSuccessRedirect?: string;
  demoCredentials?: Array<{
    label: string;
    username: string;
    password: string;
  }>;
}

export function LoginForm({
  title = "Login",
  subtitle = "Enter your credentials to access your account",
  onSuccessRedirect = "/",
  demoCredentials = [
    { label: "Admin", username: "admin", password: "password123" },
    { label: "Superadmin", username: "superadmin", password: "password123" },
  ],
}: LoginFormProps) {
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
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.nama}`,
      });
      
      // Clear form after successful login
      form.reset();
      
      // Redirect to appropriate page
      navigate(onSuccessRedirect);
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Username or password is incorrect",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle demo login
  const handleDemoLogin = (username: string, password: string) => {
    form.setValue("username", username);
    form.setValue("password", password);
    
    // Auto-submit the form with demo credentials
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-violet-500/10 z-0"></div>
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500"></div>
        
        <CardHeader className="space-y-1 relative z-10">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {subtitle}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/80">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Enter your username"
                          className="pl-10 h-12 border-muted/30 bg-white/50 backdrop-blur-sm"
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
                    <FormLabel className="text-foreground/80">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 h-12 pr-10 border-muted/30 bg-white/50 backdrop-blur-sm"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pt-0 pb-6 relative z-10">
          {demoCredentials && demoCredentials.length > 0 && (
            <>
              <div className="relative w-full my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted/40"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo Access
                  </span>
                </div>
              </div>
              
              <div className="grid w-full grid-cols-2 gap-2">
                {demoCredentials.map((cred) => (
                  <Button 
                    key={cred.label}
                    variant="outline" 
                    onClick={() => handleDemoLogin(cred.username, cred.password)}
                    className="text-sm h-10 border-muted/30 bg-white/30 backdrop-blur-sm hover:bg-white/50"
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" /> {cred.label}
                  </Button>
                ))}
              </div>
            </>
          )}
          
          <div className="flex justify-center w-full mt-2">
            <Link to="/anggota-login" className="text-sm text-blue-600 hover:underline">
              Login sebagai Anggota
            </Link>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            KPRI Bangun &copy; 2023 - All rights reserved
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
