import { RegisterForm } from "@/components/auth/admin/RegisterForm";

export default function RegisterPage() {
  return (
    <RegisterForm
      title="KPRI BANGUN"
      subtitle="Daftar Akun Baru"
      onSuccessRedirect="/login"
    />
  );
}
