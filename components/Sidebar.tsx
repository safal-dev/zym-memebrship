'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from '@/types';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  settings: Settings;
}

export function Sidebar({ settings }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Members', icon: Users, href: '/members' },
    { name: 'Payments', icon: CreditCard, href: '/payments' },
    { name: 'Settings', icon: SettingsIcon, href: '/settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 z-40 border-r border-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              {settings.gymName?.[0] || 'G'}
            </div>
            <span className="text-xl font-bold tracking-tight">{settings.gymName || 'GymConnect'}</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                  <span className="font-semibold">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (GymConnect Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full rounded-t-[32px] z-50 bg-white/80 backdrop-blur-32 border-t border-white/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center px-4 pt-3 pb-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center transition-all active:scale-90 duration-150 py-1 px-3 rounded-2xl",
                  isActive 
                    ? "text-blue-600 bg-blue-50/50" 
                    : "text-slate-400"
                )}
              >
                <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
                <span className="text-[11px] font-semibold uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
