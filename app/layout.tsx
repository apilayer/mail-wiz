import type { Metadata, Viewport } from "next";
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import { SITE, SITE_URL } from "./lib/site";
import { StructuredData } from "./components/StructuredData";
import "./globals.css";

/**
 * Open Sans throughout, Source Code Pro for raw data, matching the other
 * APILayer devtools. Weight 600 is the heading weight.
 *
 * The CSS variables are deliberately not named --font-sans / --font-mono:
 * those are Tailwind's own theme tokens, and pointing one at itself silently
 * breaks the family.
 */
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} · Free email verification`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "email verification",
    "check if an email address is real",
    "email validator",
    "verify email address",
    "bulk email verification",
    "disposable email checker",
    "catch-all domain check",
    "mx record lookup",
    "mailboxlayer",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.tagline} Verify any address free.`,
    description: SITE.description,
    locale: SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · Free email verification`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  authors: [{ name: "APILayer", url: "https://apilayer.com/" }],
  creator: "APILayer",
};

/** themeColor belongs in `viewport`; in `metadata` it is dropped from the head. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} ${sourceCodePro.variable} h-full antialiased`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
