import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({ 
  subsets: ["latin", "bengali"],
  weight: ['300', '400', '500', '600', '700'] 
});

export const metadata = {
  title: "Bidyut Geche? | Live Power Outage Tracker",
  description: "Crowdsourced load-shedding and power outage tracker. Real-time updates and community reports.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${hindSiliguri.className} min-h-screen flex flex-col bg-background text-foreground overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
