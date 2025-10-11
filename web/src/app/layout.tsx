import type { Metadata } from "next";
import { Aboreto } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const aboreto = Aboreto({
  weight: "400",
  variable: "--font-aboreto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HerRide",
  description: "Safety for women, serenity for the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aboreto.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
