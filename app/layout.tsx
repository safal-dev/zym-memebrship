import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { Toaster } from 'sonner';
import { getSettings } from '@/lib/fileDb';
import { MobileMenuProvider } from '@/context/MobileMenuContext';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gym Membership Management',
  description: 'Manage your gym members and payments easily.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen text-on-background`}>
        <MobileMenuProvider>
          <div className="flex min-h-screen">
            <Toaster position="top-right" richColors />
            <Sidebar settings={settings} />
            <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden md:pl-64">
              <Navbar settings={settings} />
              <main className="flex-1 p-4 md:p-8 pt-20">
                {children}
              </main>
            </div>
          </div>
        </MobileMenuProvider>
      </body>
    </html>
  );
}
