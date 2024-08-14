'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function DesktopDoubtSolving() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true); // Set loading to true when the component mounts
  }, [pathname]);
 

  const handleLoad = () => {
    setLoading(false); // Set loading to false when the iframe has loaded
  };

  if (pathname !== '/dashboard/doubt-solving') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
      <iframe
        src="https://tawk.to/chat/6510ab840f2b18434fda5678/1i530turq"
        width="400"
        height="600"
        frameBorder="0"
        className="shadow-lg border rounded-lg"
        allow="microphone; camera"
        onLoad={handleLoad}
      />
    </div>
  );
}
