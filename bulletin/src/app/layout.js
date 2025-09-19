import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "../style/style.css"

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
        <body className={`${geistSans.variable} ${geistMono.variable}`} style={{height:"61px"}}>
            <ul style={{zIndex:"1"}}>
                <li className="barElement"><Link href="/Board">Home</Link></li>
                <li className="barElement"><Link href="/">Editor</Link></li>
                <li className="barElement"><Link href="/">Browse</Link></li>
                <li className="barElement"><Link href="/">Account</Link></li>
            </ul>
            {children}
        </body>
      </html>
    )
}
