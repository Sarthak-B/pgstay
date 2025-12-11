import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
// Import the provider
import { AuthProvider } from "@/components/auth-context"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PGStay - Find Your Perfect Student Home",
  description: "Verified PGs and hostels for students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="">
      <body className={inter.className}>
        {/* Wrap children with AuthProvider */}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
