import { NavLink, Link } from 'react-router-dom';
import { Film, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { UserNav } from './UserNav';
import { Button } from '@/components/ui/button';
export function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-zinc-800 text-white'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    );
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? "/creator" : "/"} className="flex items-center gap-2">
          <Clapperboard className="h-7 w-7 text-indigo-400" />
          <span className="font-display text-xl font-bold text-white">
            ClipCraft AI
          </span>
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              <NavLink to="/creator" className={navLinkClass}>
                <Film className="h-4 w-4" />
                Creator
              </NavLink>
              <NavLink to="/videos" className={navLinkClass}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 3v18" />
                  <path d="m15.6 8.4-3.2 3.2 3.2 3.2" />
                </svg>
                My Videos
              </NavLink>
            </nav>
            <UserNav />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="text-white hover:bg-zinc-800">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link to="/signup">Sign Up Free</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}