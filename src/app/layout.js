import { Inter } from "next/font/google";
import "./globals.css";
import Home from "./page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PulseZest Learning",
  description: "The Kind of learning Area.",
  icon: "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/logo.png?alt=media&token=208465a0-63ae-4999-9c75-cf976af6a616"  
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
