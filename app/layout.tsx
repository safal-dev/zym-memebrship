import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gym Membership Management',
  description: 'Manage your gym members and payments easily.',
};

import { Toaster } from 'sonner';

import { getSettings } from '@/lib/fileDb';

import { MobileMenuProvider } from '@/context/MobileMenuContext';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen text-gray-900`}>
        <MobileMenuProvider>
          <div className="flex min-h-screen">
            <Toaster position="top-right" richColors />
            <Sidebar gymName={settings.gymName} />
            <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
              <Navbar gymName={settings.gymName} />
              <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                {children}
              </main>
            </div>
          </div>
          <BottomNav />
        </MobileMenuProvider>
      </body>
    </html>
  );
}
