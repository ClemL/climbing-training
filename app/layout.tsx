import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import DensitySync from "@/components/DensitySync";
import ExerciseSheet from "@/components/ExerciseSheet";
import NavigationSync from "@/components/NavigationSync";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const ui = Archivo({ subsets: ["latin"], variable: "--font-ui", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Training Day Plans",
  description:
    "Free weight, bodyweight, climbing gym and warm-up session plans with a session clock, supersets and a checklist. Stored locally, nothing synced.",
  applicationName: "Training Days",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Training Days" },
  icons: { icon: "/icon-192.png", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0e1116",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ui.variable} ${mono.variable}`}>
      <body>
        <div className="shell">{children}</div>
        <ExerciseSheet />
        <NavigationSync />
        <DensitySync />
        <ServiceWorker />
      </body>
    </html>
  );
}
