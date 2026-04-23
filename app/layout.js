import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bidyut Geche? | Live Power Outage Tracker",
  description: "Crowdsourced load-shedding and power outage tracker. Real-time updates and community reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
