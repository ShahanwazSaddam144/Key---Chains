import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Key & Chains - Premium Keychains Online Store",
  description: "Shop high-quality keychains online at Key & Chains. Unique designs, durable materials, and perfect gifts for everyone. Fast shipping and secure checkout.",
  keywords: "keychains, custom keychains, gift keychains, personalized keychains, premium keychains, key accessories, online keychain store",
  authors: [{ name: "Shahnawaz Saddam Butt", url: "https://buttnetworks.com" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  themeColor: "#1E40AF", // optional theme color for browser
  icons: {
    icon: '/butt.png',
  },
  openGraph: {
    title: "Key & Chains - Premium Keychains Online Store",
    description: "Discover and shop premium keychains online at Key & Chains. Perfect gifts and unique designs delivered fast.",
    url: "https://yourwebsite.com", // replace with your domain
    siteName: "Key & Chains",
    images: [
      {
        url: "/og-image.png", // ideally an OG image representing your store
        width: 1200,
        height: 630,
        alt: "Key & Chains Online Store",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Key & Chains - Premium Keychains Online Store",
    description: "Shop high-quality keychains online. Unique designs, perfect gifts, fast shipping.",
    images: ["/og-image.png"], // same OG image for Twitter
    creator: "@yourTwitterHandle", // optional
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
