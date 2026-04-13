import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Africa Health Financing Dashboard — African Renaissance Trust",
  description: "Interactive analytics platform for tracking, visualizing, comparing, and benchmarking domestic health financing data across all 55 African Union Member States. Supporting the ALM Declaration and 2025 Joint STC Declaration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-slate-800 bg-[#F1F5F9]`} suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
