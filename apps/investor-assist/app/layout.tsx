import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "NeuralTrade — Market Event Simulator",
  description:
    "Analyze news events and predict their impact on your portfolio using Monte Carlo simulations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
