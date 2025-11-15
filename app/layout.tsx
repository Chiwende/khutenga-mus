import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/sidebar';
import SuperBaseProvider from '@/provider/SuperbaseProvider';
import UserProvider from '@/provider/UserProvider';
import ModalProvider from '@/provider/ModalProvider';
import ToasterProvider from '@/provider/ToasterProvider';
import { SessionFeedProvider } from '@/provider/SessionFeedProvider';
import getSongsByUserId from '@/actions/getSongsByUserId';
import Player from '@/components/player';
import getActiveProductsWithPrices from '@/actions/getActiveProductsWithPrices';
import '@radix-ui/themes/styles.css';

// +260

const font = Figtree({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Khutenga Music',
    template: '%s | Khutenga Music',
  },
  description: 'Listen to music',
  applicationName: 'Khutenga Music',
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userSongs = await getSongsByUserId();
  const products = await getActiveProductsWithPrices();
  console.log(userSongs);

  return (
    <html lang='en'>
      <body className={font.className}>
        <ToasterProvider />
        <SuperBaseProvider>
          <SessionFeedProvider>
            <UserProvider>
              <ModalProvider products={products} />
              <Sidebar songs={userSongs}>{children}</Sidebar>
              <Player />
            </UserProvider>
          </SessionFeedProvider>
        </SuperBaseProvider>
      </body>
    </html>
  );
}
