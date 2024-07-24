import { Inter } from "next/font/google";
import "./globals.css";
import Home from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PulseZest Learning",
  description: "The Kind of learning Area.",
};

export default function RootLayout( {children}) {

  
  return (
    <html lang="en">
      
      <body className={inter.className} >
        
        <Home/>
        {/* <Herosection/> */}
       {children}
      </body>
    </html>
  );
}
