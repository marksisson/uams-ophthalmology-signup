import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UAMS Ophthalmology Interest Group",
  description: "Join the UAMS Ophthalmology Interest Group mailing list.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
