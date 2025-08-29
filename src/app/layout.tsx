import type { Metadata } from "next";
import { Geist, Geist_Mono, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Jae Birdsall - Developer",
    template: "%s | Jae Birdsall"
  },
  description: "Jae Birdsall is a Machine Learning Engineer and Full Stack Developer specializing in AI/ML systems, computer vision, and modern web applications. Currently pursuing ML Research at Penn State.",
  keywords: [
    "JaeMin Birdsall",
    "Jae Birdsall",
    "Machine Learning Engineer",
    "Full Stack Developer", 
    "AI Developer",
    "Computer Vision",
    "React Developer",
    "Python Developer",
    "TensorFlow",
    "PyTorch",
    "Next.js",
    "TypeScript",
    "Penn State",
    "ML Research",
    "Web Development",
    "Software Engineer"
  ],
  authors: [
    {
      name: "Jae Birdsall",
      url: "https://jaebirdsall.com"
    }
  ],
  creator: "Jae Birdsall",
  publisher: "Jae Birdsall",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jaebirdsall.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jaebirdsall.com", // Replace with your actual domain
    title: "Jae Birdsall - Developer",
    description: "Jae Birdsall is a Machine Learning Engineer and Full Stack Developer specializing in AI/ML systems, computer vision, and modern web applications.",
    siteName: "Jae Birdsall Portfolio",
    images: [
      {
        url: "/og-image.png", // You'll need to create this
        width: 1200,
        height: 630,
        alt: "Jae Birdsall - Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jae Birdsall - Developer",
    description: "Machine Learning Engineer and Full Stack Developer specializing in AI/ML systems, computer vision, and modern web applications.",
    images: ["/og-image.png"], // Same image as OpenGraph
    creator: "@yourtwitterhandle", // Replace with your Twitter handle if you have one
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these if you have them
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${atkinsonHyperlegible.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
