import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "PMO Decision Brief Builder",
  description: "Fixture-first decision support for PMO notes, options, and risks."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
