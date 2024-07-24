'use client'
import { useRouter } from 'next/navigation';

export default function ExplorePhoneScreen() {
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push('/notifications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 text-gray-800">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">Explore</h1>
        
      </header>

      <main className="p-4">
        
      </main>

     
    </div>
  );
}
