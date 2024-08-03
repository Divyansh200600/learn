import Head from 'next/head';
import Footer from '../../../components/footer/page';
export default function TermsAndConditions() {
  return (
    <div>
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Terms and Conditions</title>
      </Head>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">Terms and Conditions</h1>
            <p className="mt-4 text-gray-600">Last updated: July 31, 2024</p>
            <div className="mt-6">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="mt-2 text-gray-600">
                These Terms and Conditions (&quot;Terms&quot;, &quot;Terms and Conditions&quot;) govern your relationship with our website (the &quot;Service&quot;) operated by us (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
              </p>
              <h2 className="text-xl font-semibold mt-4">2. Accounts</h2>
              <p className="mt-2 text-gray-600">
                When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <h2 className="text-xl font-semibold mt-4">3. Termination</h2>
              <p className="mt-2 text-gray-600">
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <h2 className="text-xl font-semibold mt-4">4. Governing Law</h2>
              <p className="mt-2 text-gray-600">
                These Terms shall be governed and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.
              </p>
              <h2 className="text-xl font-semibold mt-4">5. Changes</h2>
              <p className="mt-2 text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              <h2 className="text-xl font-semibold mt-4">6. Contact Us</h2>
              <p className="mt-2 text-gray-600">
                If you have any questions about these Terms, please contact us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
<Footer/>
    </div>
  );
}
