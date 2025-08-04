import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "bulletin",
  description: "Your digital bulletin board",
};

export default function RootLayout({ children }){
    return(
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <ul>
                <li><Link href="/Home">Home</Link></li>
                <li><Link href="/Editor">Editor</Link></li>
                <a href="">Browse</a>
                <a href="">Account</a>
            </ul>
            {children}
        </body>
      </html>
    )
}
