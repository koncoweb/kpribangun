
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const demoCredentials = [
    { label: "Superadmin", username: "superadmin", password: "password123" },
    { label: "Admin", username: "admin", password: "password123" },
    { label: "Anggota", username: "anggota1", password: "password123" },
  ];

  return (
    <LoginForm
      title="KPRI BANGUN"
      subtitle="Login Admin"
      demoCredentials={demoCredentials}
    />
  );
}
