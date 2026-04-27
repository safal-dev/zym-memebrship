'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CalendarClock, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';

export function Sidebar({ gymName }: { gymName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useMobileMenu();

  if (pathname === '/login') return null;

  const menuItems = [
    { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Members', icon: Users, href: '/members' },
    { name: 'Revenue', icon: DollarSign, href: '/payments' },
    { name: 'Expiring', icon: CalendarClock, href: '/expired' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
    close();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
          onClick={close}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-onyx-background border-r border-onyx-outline/10 transform transition-transform duration-500 ease-[cubic-bezier(0.2,0,0,1)] lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-24 px-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.2em] text-onyx-tertiary uppercase mb-1">Kinetic Sanctuary</span>
            <h1 className="text-xl font-display font-black text-onyx-on-surface tracking-tight truncate">
              {gymName}
            </h1>
          </div>
          <button onClick={close} className="lg:hidden p-2 text-onyx-on-surface-variant hover:text-white transition-onyx">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl transition-onyx group relative overflow-hidden",
                  isActive 
                    ? "bg-onyx-surface text-onyx-primary" 
                    : "text-onyx-on-surface-variant hover:text-onyx-on-surface hover:bg-onyx-surface/40"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-onyx",
                  isActive ? "text-onyx-tertiary" : "group-hover:scale-110"
                )} />
                <span className="font-display font-bold text-sm tracking-wide">{item.name}</span>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-onyx-tertiary rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-6 py-4 text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-onyx font-display font-bold text-sm tracking-wide"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
