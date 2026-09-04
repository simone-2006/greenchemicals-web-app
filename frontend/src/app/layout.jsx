import './globals.css';

import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Greenchemicals WEB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className='bg-background-element p-3'>
        <Navbar></Navbar>
        <div className='bg-background rounded-xl p-2 border border-border mt-2 '>
          {children}
        </div>
      </body>
    </html>
  );
}