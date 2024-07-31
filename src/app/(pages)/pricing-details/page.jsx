// pages/pricing-details.js

export default function PricingDetails() {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-blue-800 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">PulseZest</h1>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Pricing Details</h2>
            <p className="text-gray-700 mb-4">
              Welcome to the PulseZest Pricing Details page. Here you can find all the information regarding the pricing of our various services and subscriptions.
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Subscription Plans</h3>
            <p className="text-gray-700 mb-4">
              We offer several subscription plans to cater to different needs. Choose the plan that best fits your requirements:
              <ul className="list-disc ml-6 mt-2">
                <li><b>Basic Plan:</b> $19.99 per month. Includes access to basic features and support.</li>
                <li><b>Standard Plan:</b> $39.99 per month. Includes all basic features plus additional features and priority support.</li>
                <li><b>Premium Plan:</b> $59.99 per month. Includes all features from Standard Plan, advanced tools, and premium support.</li>
              </ul>
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. One-Time Purchases</h3>
            <p className="text-gray-700 mb-4">
              In addition to our subscription plans, we offer one-time purchases for specific services:
              <ul className="list-disc ml-6 mt-2">
                <li><b>Service A:</b> $99.99. Includes a one-time setup and configuration.</li>
                <li><b>Service B:</b> $199.99. Includes a comprehensive setup, training, and support.</li>
              </ul>
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Discounts and Offers</h3>
            <p className="text-gray-700 mb-4">
              We periodically offer discounts and special promotions. Please check our website regularly or contact our support team to learn about current offers.
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Payment Methods</h3>
            <p className="text-gray-700 mb-4">
              We accept various payment methods including:
              <ul className="list-disc ml-6 mt-2">
                <li>Credit/Debit Cards</li>
                <li>PayPal</li>
                <li>Bank Transfers</li>
              </ul>
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Contact Us</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions regarding our pricing or need assistance with billing, please contact us at:
              <br />
              Email: <a href="mailto:support@pulsezest.com" className="text-blue-600 hover:underline">support@pulsezest.com</a>
            </p>
          </div>
        </main>
  
        {/* Footer */}
        <footer className="bg-blue-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} PulseZest. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }
  