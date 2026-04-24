import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({ 
  subsets: ["latin", "bengali"],
  weight: ['300', '400', '500', '600', '700'] 
});

export const metadata = {
  title: "বিদ্যুৎ নাই? | লাইভ লোডশেডিং ট্র্যাকার (Bidyut Nai)",
  description: "বাংলাদেশের যেকোনো এলাকার লোডশেডিং ও বিদ্যুৎ বিভ্রাটের রিয়েল-টাইম আপডেট জানুন। ম্যাপের মাধ্যমে লাইভ চেক করুন এবং আপনার এলাকার বর্তমান অবস্থা রিপোর্ট করুন।",
  keywords: ["Bidyut Nai", "Load Shedding Tracker", "Power Outage BD", "বিদ্যুৎ নাই", "লোডশেডিং ট্র্যাকার", "লাইভ বিদ্যুৎ আপডেট", "Bangladesh Power", "Live Outage Map"],
  authors: [{ name: "Bidyut Nai Platform" }],
  openGraph: {
    title: "বিদ্যুৎ নাই? | লাইভ লোডশেডিং ট্র্যাকার",
    description: "আপনার এলাকায় কি বিদ্যুৎ আছে? ম্যাপের মাধ্যমে লাইভ জানুন বাংলাদেশের কোন এলাকায় বিদ্যুৎ আছে আর কোথায় নেই।",
    siteName: "Bidyut Nai",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "বিদ্যুৎ নাই? | লাইভ লোডশেডিং ট্র্যাকার",
    description: "ম্যাপের মাধ্যমে লাইভ জানুন বাংলাদেশের কোন এলাকায় বিদ্যুৎ আছে আর কোথায় নেই।",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "FyYuYyMHAUsCFEsy03xquRG3RYlLTgwQHegKEwumL3g",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.className} min-h-screen flex flex-col bg-background text-foreground overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
