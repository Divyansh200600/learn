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
        <h1 className="allign-centre text-4xl">404 Error 🚀</h1>
        {/* <Home/>
        {/* <Herosection/> */}
       {/* {children}  */}
      </body>
    </html>
  );
}
	