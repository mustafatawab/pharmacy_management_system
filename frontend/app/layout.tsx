import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import TenStackProvider from "@/providers/TenStackProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata = {
  title: "Pharmacy Management System",
  description: "Pharmacy Management System developed by WS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TenStackProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </TenStackProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
