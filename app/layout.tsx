import type { Metadata } from "next";
import { Ovo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import HireMeLink from "@/components/HireMeLink";

const ovo = Ovo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ovo",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://srajan_2026.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "srajan",
    template: "%s | srajan",
  },
  description:
    "Srajan Gupta - Fullstack engineer, builder, and marketer. Chasing knowledge, solving problems, failing loudly. Creator of DailyGeeta, RiddleBox, and AltmanGPT.",
  keywords: [
    "Srajan",
    "Srajan Gupta",
    "creation22",
    "_creation22",
    "Fullstack Engineer",
    "Product Engineer",
    "DailyGeeta",
    "RiddleBox",
    "AltmanGPT",
    "Next.js Developer",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Srajan", url: "https://x.com/_creation22" }],
  creator: "Srajan",
  publisher: "Srajan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "srajan - fullstack engineer & builder",
    description:
      "Chasing knowledge, solving problems, failing loudly. Fullstack engineer building DailyGeeta, RiddleBox, AltmanGPT & more.",
    siteName: "srajan",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 800,
        alt: "srajan - wireframe chess king & math formulas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "srajan - fullstack engineer & builder",
    description:
      "Chasing knowledge, solving problems, failing loudly. Creator of DailyGeeta, RiddleBox, and AltmanGPT.",
    creator: "@_creation22",
    images: ["/icon.png"],
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Srajan Gupta",
      alternateName: ["Srajan", "creation22", "_creation22"],
      url: siteUrl,
      image: `${siteUrl}/icon.png`,
      sameAs: [
        "https://x.com/_creation22",
        "https://github.com/creation22",
        "https://linkedin.com/in/ssrajangupta22/",
        "https://leetcode.com/creation22",
        "https://www.instagram.com/srajangupta.x/",
        "https://medium.com/@creation2224",
      ],
      jobTitle: "Fullstack Engineer & Builder",
      knowsAbout: [
        "Fullstack Development",
        "Next.js",
        "React",
        "TypeScript",
        "RAG",
        "Marketing & Sales",
        "Chess",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "srajan",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png?v=2" />
        <link rel="shortcut icon" href="/icon.png?v=2" />
        <link rel="apple-touch-icon" href="/icon.png?v=2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${ovo.variable} antialiased`}>
        <ThemeProvider>
          <HireMeLink />
          <div className="min-h-screen flex flex-col items-center">
            <div className="w-full max-w-2xl px-6 pt-20">
              <Navigation />
              {children}
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
