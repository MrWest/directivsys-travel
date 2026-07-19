import type { Metadata } from 'next';
import { Geist, Pacifico } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ReservationProvider } from '../context/ReservationContext';
import Header from '../components/Header';
import ChatWidgetLoader from '../components/ChatWidgetLoader';
import { DirectivSysWrapper } from '../components/DirectivSysWrapper';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const pacifico = Pacifico({ subsets: ['latin'], weight: '400', variable: '--font-pacifico' });

export const metadata: Metadata = {
  title: 'Barbados Bliss — Luxury Travel',
  description: 'Luxury travel booking powered by DirectivSys AI orchestration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${pacifico.variable} ${geist.className} bg-white text-slate-800`}>
        <DirectivSysWrapper>
          <AuthProvider>
            <ReservationProvider>
              <Header />
              <main className="pt-16">
                {children}
              </main>
              <ChatWidgetLoader />
            </ReservationProvider>
          </AuthProvider>
        </DirectivSysWrapper>
      </body>
    </html>
  );
}
