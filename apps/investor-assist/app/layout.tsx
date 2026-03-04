import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuralTrade — Market Event Simulator",
  description: "Analyze news events and predict their impact on your portfolio using Monte Carlo simulations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
