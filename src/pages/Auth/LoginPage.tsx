
import { LoginForm } from "@/components/auth/admin/LoginForm";

export default function LoginPage() {
  return (
    <LoginForm
      title="KPRI BANGUN"
      subtitle="Login Admin"
      onSuccessRedirect="/"
    />
  );
}
