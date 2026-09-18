import './globals.css';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Greenchemicals WEB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-background-element min-h-screen h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col p-4">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}