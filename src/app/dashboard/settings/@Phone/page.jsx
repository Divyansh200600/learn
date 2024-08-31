'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PassChanger from '../../../../components/SettingsComponent/passChange';
import Logout from '../../../../components/SettingsComponent/logout';

export default function SettingsPhonePage() {
  const router = useRouter();

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col pb-[calc(60px+1rem)]">
      <button
        onClick={() => router.push('/dashboard/profile')}
        className="text-blue-500 mb-4 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Settings ⚙️</h1>
      <div className="flex-1 space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-2">Account Settings</h2>
          <PassChanger />
        </div>
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-2">Notifications</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Enable notifications</span>
          </label>
        </div> */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-2">Support</h2>
          <p className="text-gray-700 mb-2">For any issues or feedback, contact our support team.</p>
          <a href="mailto:pulsezest-learning-management@pulsezest.com" className="text-blue-500 hover:underline">Email Support</a>
        </div>
        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-2">Privacy Settings</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Enable two-factor authentication</span>
          </label>
          <label className="flex items-center space-x-3 mt-2">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Allow data sharing with partners</span>
          </label>
        </div> */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-medium mb-2">About Us & Privacy Policy</h2>
          <p className="text-gray-700 mb-2">
            Learn more about our
            <a
              href="https://learning.pulsezest.com/about-us"
              className="text-blue-500 hover:underline font-semibold mr-2"  // Styling for "About Us"
              rel="noopener noreferrer"
            >
              About Us
            </a>
            and our
            <a
              href="https://learning.pulsezest.com/privacy-policy"
              className="text-green-500 hover:underline font-semibold ml-2" // Styling for "Privacy Policy"
              
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>.
          </p>
        </div>

      </div>
      <div className="pt-4 pb-8">
        <Logout />
      </div>
    </div>
  );
}
