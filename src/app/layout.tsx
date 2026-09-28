import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMK Telekomunikasi Tunas Harapan",
  description: "Website profil dan informasi SMK Telekomunikasi Tunas Harapan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" className={`${geistSans.variable} ${geistMono.variable} antialiased`}><body>{children}</body></html>;
}
