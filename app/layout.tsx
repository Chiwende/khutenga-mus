import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';
import SuperBaseProvider from '@/provider/SuperbaseProvider';
import UserProvider from '@/provider/UserProvider';
import ModalProvider from '@/provider/ModalProvider';
import ToasterProvider from '@/provider/ToasterProvider';
import getSongsByUserId from '@/actions/getSongsByUserId';

const font = Figtree({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Khutenga Music',
  description: 'Listen to music',
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSongs = await getSongsByUserId();

  return (
    <html lang='en'>
      <body className={font.className}>
        <ToasterProvider />
        <SuperBaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>{children}</Sidebar>
          </UserProvider>
        </SuperBaseProvider>
      </body>
    </html>
  );
}
