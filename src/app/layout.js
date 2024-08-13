// RootLayout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Home from "./page"; // Ensure the path to Home is correct

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PulseZest Learning",
  description: "The King 👑 of Learning Area",
    
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icon} />
      </head>
      <body className={inter.className}>
        <Home /> {/* Render Home component directly */}
        {children} {/* Render other page content here */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              function loadTawkTo() {
                var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
                (function() {
                  var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
                  s1.async = true;
                  s1.src = 'https://embed.tawk.to/6510ab840f2b18434fda5678/1i4cnvv37';
                  s1.charset = 'UTF-8';
                  s1.setAttribute('crossorigin', '*');
                  s0.parentNode.insertBefore(s1, s0);
                })();
              }

              if (window.innerWidth >= 1024) { // Check for desktop screen width
                loadTawkTo();
              }
              window.addEventListener('resize', function() {
                if (window.innerWidth >= 1024) {
                  loadTawkTo();
                }
              });
            `,
          }}
        /> */}
      </body>
    </html>
  );
}
