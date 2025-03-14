import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./globals.css";

const ubuntuSans = Ubuntu({
  variable: "--font-ubuntu-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const ubuntuMono = Ubuntu_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "NotesBucket",
  description: "Wszystkie notatki w jednym miejscu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className="scrollbar scrollbar-track-transparent scrollbar-thumb-primary"
    >
      <body
        className={`${ubuntuSans.variable} ${ubuntuMono.variable} antialiased font-sans bg-background `}
      >
        {children}
      </body>
    </html>
  );
}
