import type { Metadata, Viewport } from "next";
import { Bangers, Kalam, Nunito } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const body = Nunito({ variable: "--font-body", subsets: ["latin"] });
const hand = Kalam({ variable: "--font-hand", subsets: ["latin"], weight: ["400", "700"] });
const comic = Bangers({ variable: "--font-comic", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: { default: "Chalkadoo — learn maths by doing", template: "%s · Chalkadoo" },
  description:
    "Interactive maths lessons for every level. Push, slide and solve your way from fractions to calculus.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1d2924" },
  ],
};

// Applies a saved theme choice before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("chalkadoo:theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${hand.variable} ${comic.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
