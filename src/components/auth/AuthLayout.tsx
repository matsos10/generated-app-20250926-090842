import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';
interface AuthLayoutProps {
  children: React.ReactNode;
}
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950 to-indigo-950/50 -z-10" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Clapperboard className="h-8 w-8 text-indigo-400" />
            <span className="font-display text-2xl font-bold text-white">
              ClipCraft AI
            </span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}