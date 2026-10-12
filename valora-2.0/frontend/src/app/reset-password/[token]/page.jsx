import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({ params }) {
  const { token } = await params;

  return (
    <main className=" pt-4">
      <ResetPasswordForm token={token} />
    </main>
  );
}