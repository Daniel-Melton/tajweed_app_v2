import type { Metadata } from "next";
import Providers from "@/components/Providers"; // استدعاء الملف الجديد
import "./globals.css"; // أو ملف الـ CSS الخاص بك

export const metadata: Metadata = {
  title: "أكاديمية التجويد",
  description: "نظام إدارة تعلم أحكام التجويد",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}