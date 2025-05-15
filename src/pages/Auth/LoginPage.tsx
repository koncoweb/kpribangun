
import { LoginForm } from "@/components/auth/admin/LoginForm";

export default function LoginPage() {
  const demoCredentials = [
    { label: "Superadmin", username: "superadmin", password: "password123" }
  ];

  return (
    <LoginForm
      title="KPRI BANGUN"
      subtitle="Login Admin"
      demoCredentials={demoCredentials}
      onSuccessRedirect="/"
    />
  );
}
