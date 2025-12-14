import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarBackground from "@/components/StarBackground";
import Providers from "@/components/Providers";
import GoogleAdSense from "@/components/GoogleAdSense";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "UniverseHub – Explore the Infinite",
  description: "Real-time space news, missions, planets, and universe updates.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${orbitron.variable} font-sans bg-space-black text-white`}>
        <GoogleAdSense pId="ca-pub-9930503261813762" />
        <Providers>
          {/* Stars Background */}
          <StarBackground starCount={1000} speedFactor={0.2} />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
