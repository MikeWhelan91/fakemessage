import './globals.css';

export const metadata = {
  title: "Fake WhatsApp Chat Generator",
  description: "Create realistic fake WhatsApp chats and download PNGs that match the preview exactly. Free, no signup."
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
