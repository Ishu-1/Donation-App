"use client";

import localFont from "next/font/local";
import NgoNavbar from "../components/Navbar";
import NgoFooter from "../components/Footer";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { NextUIProvider } from "@nextui-org/react";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const excludeNavbar =
    pathname === "/auth/login" || pathname === "/auth/signup";

  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable}`}
      >
        <NextUIProvider>
          <SessionProvider>
            {!excludeNavbar && <NgoNavbar />}
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <main className="flex-grow">{children}</main>
            {!excludeNavbar && <NgoFooter />}
          </SessionProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
