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
