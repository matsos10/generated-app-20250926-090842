import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
export function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}