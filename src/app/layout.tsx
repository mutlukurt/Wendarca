import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wendarca.vercel.app"),
  title: "Wendarca — Local File Converter",
  description:
    "Convert images, videos, PDFs, and presentations directly in your browser without uploading files. Create WebP, WebM, PDFs, page images, merged PDFs, and presentation PDFs locally.",
  applicationName: "Wendarca",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Wendarca — Local File Converter",
    description: "Convert files locally in your browser without uploads, accounts, or server storage.",
    url: "https://wendarca.vercel.app",
    siteName: "Wendarca",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Wendarca — Local File Converter",
    description: "Private local file conversion for images, videos, PDFs, and presentations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetBrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
