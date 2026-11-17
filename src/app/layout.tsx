import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { SITE, SUPPLY_TEXT } from "@/lib/site";

const display = Libre_Caslon_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const plex = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
});

const description = `${SUPPLY_TEXT} machines. ${SITE.standard} on ${SITE.chain}. Own one, rent it out, get printed.`;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Layer Machines · Own › Rent › Earn",
  description,
  openGraph: {
    title: "Layer Machines",
    description,
    type: "website",
    images: [{ url: "/art/banner.jpg", width: 1280, height: 426 }],
  },
  twitter: { card: "summary_large_image", images: ["/art/banner.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0a0a0b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
