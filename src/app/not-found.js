"use client";

import RetroGrid from '../components/magicui/retro-grid';
import Footer from '../components/footer/page';
export default function NotFound() {


const handleClick = () =>{

    window.location.href = "/"
}

  return (
    <div>
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray-800 dark:bg-gray-800 md:shadow-xl">
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        404 Page Not Found
      </span>

      <RetroGrid />

      <button 
          className="mt-8 px-6 py-3 text-lg font-semibold text-white bg-green-500 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          onClick={handleClick}
        >
          Go To Home
        </button>
    
     
    </div>
     <Footer/> 
     </div>
  );
}
