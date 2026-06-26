import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "FitTrack — Gym Workout Tracker",
  description: "Track your workouts, monitor your progress, achieve your goals",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitTrack",
    startupImage: ["/icons/apple-touch-icon.png"],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          {children}
          <ServiceWorkerRegistrar />
        </Providers>
      </body>
    </html>
  );
}
