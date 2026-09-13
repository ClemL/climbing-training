import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Training Day Plans",
  description:
    "Free weight, bodyweight, climbing gym and warm-up session plans with a session clock, supersets and a checklist. Stored locally, nothing synced.",
  applicationName: "Training Day Plans",
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
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
