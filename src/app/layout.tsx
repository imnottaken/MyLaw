import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Assistant } from "@/components/assistant";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyLaw — Legal Help, Simplified",
  description: "A simpler way to discover and connect with the right legal professionals.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-square.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth overscroll-none", inter.variable, "font-sans", geist.variable)}>
      <body className="bg-[#172033] text-[#172033] font-sans antialiased min-h-screen flex flex-col overscroll-none">
        {children}
        <Assistant />
      </body>
    </html>
  );
}
