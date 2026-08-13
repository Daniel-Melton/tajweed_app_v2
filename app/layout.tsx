import type { Metadata } from "next";
import Providers from "@/components/Providers"; // استدعاء الملف الجديد
import { ThemeProvider } from "@/components/ThemeProvider";
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* بيحط كلاس الثيم المحفوظ قبل أول رسم للصفحة عشان مفيش وميض (flash) بلون غلط */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              var t = localStorage.getItem('theme');
              if (t === 'dark') document.documentElement.classList.add('dark');
            } catch (e) {}`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}