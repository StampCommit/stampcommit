import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StampCommit — Build. Deliver. Commit.",
  description:
    "StampCommit delivers innovative software solutions specializing in BLE connectivity, IoT systems, mobile development with Flutter, React Native, Android & iOS. Our first project, zPrint, is coming soon.",
  keywords: [
    "StampCommit",
    "BLE",
    "Bluetooth Low Energy",
    "IoT",
    "software solutions",
    "zPrint",
    "Flutter",
    "React Native",
    "Android",
    "iOS",
    "mobile development",
    "embedded systems",
  ],
  openGraph: {
    title: "StampCommit — Build. Deliver. Commit.",
    description:
      "Innovative software solutions for BLE connectivity, IoT, and cross-platform mobile development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          {/* Background Effects */}
          <div className="grid-bg" aria-hidden="true" />
          <div className="orb orb-1" aria-hidden="true" />
          <div className="orb orb-2" aria-hidden="true" />

          <Navbar />
          <main style={{ flex: 1, paddingTop: "var(--nav-height)" }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
