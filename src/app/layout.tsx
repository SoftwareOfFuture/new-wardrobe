import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings["seo.title"] || "NEW WARDROBE | Premium Mobilya";
  const description = settings["seo.description"] || "Premium mobilya ve gardırop çözümleri.";
  const siteName = settings["site.name"] || "NEW WARDROBE";
  const ogImage = settings["seo.og_image"] || undefined;

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    ...(ogImage && {
      openGraph: { images: [ogImage] },
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "oklch(0.14 0.005 260)",
              border: "1px solid oklch(1 0 0 / 10%)",
              color: "oklch(0.95 0 0)",
            },
          }}
        />
      </body>
    </html>
  );
}
