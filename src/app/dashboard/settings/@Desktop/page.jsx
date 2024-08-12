import React from 'react';
import PassChanger from '../../../../components/SettingsComponent/passChange';
import Logout from '../../../../components/SettingsComponent/logout';

export default function SettingsDesktopPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-5xl text-black mb-8">Settings ⚙️</h1>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-medium mb-4">Account Settings</h2>
          <PassChanger />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-medium mb-4">Notifications</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Enable notifications</span>
          </label>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-medium mb-4">Support</h2>
          <p className="text-gray-700 mb-4">For any issues or feedback, contact our support team.</p>
          <a href="mailto:support@pulsezest.com" className="text-blue-500 hover:underline">Email Support</a>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-medium mb-4">Privacy Settings</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Enable two-factor authentication</span>
          </label>
          <label className="flex items-center space-x-3 mt-2">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Allow data sharing with partners</span>
          </label>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-medium mb-4">About Us & Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            Learn more about our <a href="https://learning.pulsezest.com/about-us" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">About Us</a> and our <a href="https://learning.pulsezest.com/privacy-policy" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <Logout />
      </div>
    </div>
  );
}
