import { SignInCard } from '@/components/forms/sign-in-card';

export const metadata = {
  title: 'Iniciar sesión | SyncFit'
};

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SignInCard />
    </main>
  );
}
