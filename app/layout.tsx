import type { Metadata, Viewport } from "next";
import DisplaySync from "@/components/DisplaySync";
import ExerciseSheet from "@/components/ExerciseSheet";
import NavigationSync from "@/components/NavigationSync";
import ServiceWorker from "@/components/ServiceWorker";
import { BOOT_SCRIPT } from "@/lib/display";
import "./globals.css";

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
  themeColor: "#0b0f14",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The boot script sets data attributes on <html> before React hydrates it.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <div className="shell">{children}</div>
        <ExerciseSheet />
        <NavigationSync />
        <DisplaySync />
        <ServiceWorker />
      </body>
    </html>
  );
}
