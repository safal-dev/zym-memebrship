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
  X,
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMobileMenu } from '@/context/MobileMenuContext';

export function Sidebar({ gymName }: { gymName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, close } = useMobileMenu();

  if (pathname === '/login') return null;

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Members', icon: Users, href: '/members' },
    { name: 'Payments', icon: DollarSign, href: '/payments' },
    { name: 'Expiring', icon: CalendarClock, href: '/expired' },
    { name: 'Billing', icon: CreditCard, href: '/billing' },
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-20 border-b border-gray-800 px-6">
          <h1 className="text-xl font-bold text-white tracking-wider flex items-center gap-2 truncate">
            <span className="text-blue-500 uppercase">{gymName.split(' ')[0]}</span> {gymName.split(' ').slice(1).join(' ')}
          </h1>
          <button onClick={close} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={close}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                pathname === item.href 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
