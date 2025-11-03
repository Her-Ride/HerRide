import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import { Aboreto, Inter } from 'next/font/google'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import './globals.css'

const aboreto = Aboreto({
  weight: "400",
  variable: "--font-aboreto",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

    <ClerkProvider appearance={{
      theme: 'simple',
    }}>
      <html lang="en">
        <body className={`${aboreto.variable} ${inter.variable} antialiased`}>
          <SignedOut>
            <Header isSignedIn={false} />
          </SignedOut>
          <SignedIn>
            <Header isSignedIn={true} />
          </SignedIn>
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}


