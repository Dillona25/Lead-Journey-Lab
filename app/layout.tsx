import type { Metadata } from "next";
import { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import AnalyticsShell from "./analytics-shell";
import GoogleTagManager from "./google-tag-manager";

export const metadata: Metadata = {
  title: "Black Friday Campaign Simulator",
  description: "A learning environment for testing campaign attribution flows.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <AnalyticsShell />
        </Suspense>
        {children}
        <GoogleTagManager />
      </body>
    </html>
  );
}
