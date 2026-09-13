import type { Metadata, Viewport } from "next";
import { ExerciseSheetProvider } from "@/components/ExerciseSheet";
import ServiceWorker from "@/components/ServiceWorker";
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
    <html lang="en">
      <body>
        <ExerciseSheetProvider>
          <div className="shell">{children}</div>
        </ExerciseSheetProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
