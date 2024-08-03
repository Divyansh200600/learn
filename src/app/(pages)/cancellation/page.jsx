import Footer from '../../../components/footer/page';
export default function CancellationRefundPolicy() {
    return (
      <div>
      <div className="min-h-screen flex flex-col bg-gray-50">
       
  
        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-6">Cancellation and Refund Policy</h2>
            <p className="text-gray-700 mb-4">
              This Cancellation and Refund Policy outlines the terms under which you may cancel or request a refund for services provided by PulseZest. By using our services, you agree to adhere to these terms.
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Cancellation Policy</h3>
            <p className="text-gray-700 mb-4">
              If you wish to cancel a service or subscription, please follow the procedures outlined below:
              <ul className="list-disc ml-6 mt-2">
                <li>Cancellations must be submitted at least 24 hours before the service is scheduled to begin.</li>
                <li>To cancel, please contact our support team via email at <a href="mailto:support@pulsezest.com" className="text-blue-600 hover:underline">support@pulsezest.com</a>.</li>
                <li>Cancellation requests made less than 24 hours before the service may be subject to a cancellation fee.</li>
                <li>We reserve the right to refuse cancellations made after the service has commenced.</li>
              </ul>
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Refund Policy</h3>
            <p className="text-gray-700 mb-4">
              Refunds are issued based on the following conditions:
              <ul className="list-disc ml-6 mt-2">
                <li>Refund requests must be submitted within 7 days of the service or subscription start date.</li>
                <li>To request a refund, please contact our support team via email at <a href="mailto:support@pulsezest.com" className="text-blue-600 hover:underline">support@pulsezest.com</a> with your order details and reason for the refund request.</li>
                <li>Refunds will only be issued for services that were not provided as described or if there was a technical issue that prevented you from using the service.</li>
                <li>No refunds will be issued for services rendered or for reasons unrelated to service quality or technical issues.</li>
              </ul>
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Processing Time</h3>
            <p className="text-gray-700 mb-4">
              Refund requests will be processed within 14 business days. You will be notified once your refund has been approved and processed.
            </p>
  
            <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Contact Us</h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about our Cancellation and Refund Policy, please contact us at:
              <br />
              Email: <a href="mailto:support@pulsezest.com" className="text-blue-600 hover:underline">support@pulsezest.com</a>
            </p>
          </div>
        </main>
  
      
      </div>

      <Footer/>
      </div>
    );
  }
  