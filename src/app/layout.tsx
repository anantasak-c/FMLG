import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Coach | Thai AI Video",
  description: "ช่วยวาง Creative Brief สำหรับวิดีโอ AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
