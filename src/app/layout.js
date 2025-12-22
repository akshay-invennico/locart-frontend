import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import AuthWrapper from "./AuthWrapper";
import { UserProvider } from "@/context/UserContext";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LocArt",
  description: "LocArt Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthWrapper>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
