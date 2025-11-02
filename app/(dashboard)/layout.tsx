import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-semibold text-white">
            SyncFit
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/training">Entreno</Link>
            <Link href="/nutrition">Nutrición</Link>
            <Link href="/progress">Progreso</Link>
            <Link href="/settings">Ajustes</Link>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link href="/sign-in">Salir</Link>
          </Button>
        </div>
      </nav>
      <div className="bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </div>
    </div>
  );
}
