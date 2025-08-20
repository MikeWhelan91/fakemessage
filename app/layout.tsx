import './globals.css';

export const metadata = {
  title: 'PretendChat | WhatsApp Chat Generator',
  description:
    'Design realistic WhatsApp conversations with PretendChat and download pixel-perfect images without watermark. Free tool, no signup.',
  keywords: [
    'PretendChat',
    'WhatsApp chat generator',
    'fake WhatsApp messages',
    'WhatsApp fake chat creator',
  ],
  metadataBase: new URL('https://pretendchat.com'),
  openGraph: {
    title: 'PretendChat | WhatsApp Chat Generator',
    description:
      'Create and export realistic WhatsApp chats instantly with PretendChat without watermark.',
    url: 'https://pretendchat.com',
    siteName: 'PretendChat',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-ui">
        {children}
      </body>
    </html>
  );
}

