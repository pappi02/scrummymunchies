import type { Metadata, Viewport } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const heading = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrummy Munchies | Pizza Fiesta",
  description: "Bold flavors, Buy 1 Get 1 every Tue & Fri. Order via call or WhatsApp.",
  openGraph: {
    title: "Scrummy Munchies | Pizza Fiesta",
    description: "Buy 1 Get 1 every Tuesday and Friday. Call or WhatsApp to order.",
    url: "https://scrummymunchies.example",
    siteName: "Scrummy Munchies",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e4141c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
