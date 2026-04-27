'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from '@/types';
import { 
  Bell
} from 'lucide-react';

interface NavbarProps {
  settings: Settings;
}

export function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-sm flex justify-between items-center px-5 h-16 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
          {settings.gymName?.[0] || 'G'}
        </div>
        <h1 className="text-lg font-extrabold text-blue-600 tracking-tight">
          {settings.gymName || 'GymConnect'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100/50 active:scale-95 transition-all">
          <Bell className="w-5 h-5" />
        </button>
        <div className="hidden md:block w-8 h-8 rounded-full bg-slate-200 overflow-hidden ml-2">
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
