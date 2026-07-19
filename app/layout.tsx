import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ReservationProvider } from '../context/ReservationContext';
import Header from '../components/Header';
import ChatWidgetLoader from '../components/ChatWidgetLoader';
import { DirectivSysWrapper } from '../components/DirectivSysWrapper';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DirectivTravel — Barbados',
  description: 'Luxury travel booking powered by DirectivSys AI orchestration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-slate-950 text-white`}>
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
