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
    '/members': 'Member Directory',
    '/members/add': 'Add New Member',
    '/payments': 'Financial History',
    '/expired': 'Expiry Tracking',
    '/settings': 'System Settings',
  };

  const title = Object.keys(titles).find(key => pathname.startsWith(key)) ? titles[Object.keys(titles).find(key => pathname.startsWith(key))!] : 'Dashboard';

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggle}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors hidden sm:block">
          <Bell className="w-6 h-6" />
        </button>
        <div className="h-10 w-[1px] bg-gray-100 mx-2 hidden md:block" />
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">{gymName} Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
