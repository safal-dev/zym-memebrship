'use client';

import { usePathname } from 'next/navigation';
import { Bell, Menu, User } from 'lucide-react';
import { useMobileMenu } from '@/context/MobileMenuContext';

export function Navbar({ gymName }: { gymName: string }) {
  const pathname = usePathname();
  const { toggle } = useMobileMenu();

  if (pathname === '/login') return null;

  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/members': 'Directory',
    '/members/add': 'New Entry',
    '/payments': 'Revenue',
    '/expired': 'Tracking',
    '/settings': 'Systems',
  };

  const title = Object.keys(titles).find(key => pathname.startsWith(key)) ? titles[Object.keys(titles).find(key => pathname.startsWith(key))!] : 'Dashboard';

  return (
    <header className="h-24 glassmorphism flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 border-b border-onyx-outline/5">
      <div className="flex items-center gap-6">
        <button 
          onClick={toggle}
          className="p-3 text-onyx-on-surface hover:bg-onyx-surface-highest/20 rounded-2xl lg:hidden transition-onyx"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-[0.2em] text-onyx-on-surface-variant uppercase mb-0.5">Management</span>
          <h2 className="text-2xl font-display font-black text-onyx-on-surface tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 text-onyx-on-surface-variant hover:text-onyx-on-surface hover:bg-onyx-surface-highest/20 rounded-2xl transition-onyx relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-onyx-tertiary rounded-full border-2 border-onyx-background" />
        </button>
        <div className="h-8 w-[1px] bg-onyx-outline/10 mx-2 hidden md:block" />
        <div className="flex items-center gap-4 pl-2 group cursor-pointer">
          <div className="flex flex-col text-right hidden sm:block">
            <p className="text-sm font-display font-black text-onyx-on-surface">Admin</p>
            <p className="text-[10px] font-bold text-onyx-tertiary uppercase tracking-wider">Superuser</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-onyx-surface-highest flex items-center justify-center text-onyx-primary shadow-lg transition-onyx group-hover:scale-105">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
}
