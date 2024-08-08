import React from 'react';
import Footer from '@/components/footer/page';

const TermsAndConditions = () => {
  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 08, 2024</p>

        <p className="mb-4">
          Welcome to PulseZest Learning, an educational platform where students can purchase and access courses to learn about various technologies, including but not limited to React, Flutter, and Android development. By accessing or using our Service, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using PulseZest Learning (the "Service"), you accept and agree to be bound by the terms and conditions set forth in this document (the "Agreement"). If you do not agree with these terms, please do not use the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Changes to Terms</h2>
        <p className="mb-4">
          PulseZest Learning reserves the right to modify or revise these Terms and Conditions at any time. Any changes will be posted on this page with an updated date. It is your responsibility to review these Terms periodically. Your continued use of the Service following any changes indicates your acceptance of the new Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2">
            <strong>Account Creation:</strong> To access certain features of the Service, you may be required to create an account. You must provide accurate and complete information and keep your account information updated.
          </li>
          <li className="mb-2">
            <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. PulseZest Learning is not responsible for any unauthorized access to your account.
          </li>
          <li className="mb-2">
            <strong>Eligibility:</strong> You must be at least 13 years of age to create an account and use the Service. If you are under 18, you must have parental or guardian consent.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Course Purchases</h2>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2">
            <strong>Payment:</strong> All courses on PulseZest Learning are subject to fees. Payment must be made in full before you can access the course content.
          </li>
          <li className="mb-2">
            <strong>Refund Policy:</strong> We offer a 7-day refund policy from the date of purchase, provided that less than 20% of the course has been completed. No refunds will be issued after this period.
          </li>
          <li className="mb-2">
            <strong>Course Access:</strong> Upon successful payment, you will receive access to the course material. Access is granted only to the individual account holder and is non-transferable.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Responsibilities</h2>
        <p className="mb-4">
          The courses offered are for your personal and educational use only. You may not reproduce, distribute, or share course materials with others.
        </p>
        <p className="mb-4">
          You agree not to engage in any conduct that could harm the Service, including but not limited to hacking, spreading malware, or uploading offensive content.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
        <p className="mb-4">
          All content on PulseZest Learning, including but not limited to videos, text, images, and software, is the property of PulseZest or its licensors. You may not use this content for any commercial purpose without express written permission.
        </p>
        <p className="mb-4">
          When you purchase a course, you are granted a limited, non-exclusive, non-transferable license to access and view the course content for your personal, educational use.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
        <p className="mb-4">
          PulseZest Learning strives to provide high-quality educational content but does not guarantee that the Service will meet your specific requirements or that it will be uninterrupted or error-free. PulseZest Learning is not liable for any damages resulting from the use or inability to use the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Privacy Policy</h2>
        <p className="mb-4">
          Your privacy is important to us. Please refer to our <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> for information on how we collect, use, and protect your personal data.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Termination</h2>
        <p className="mb-4">
          PulseZest Learning reserves the right to terminate your access to the Service at any time, without notice, for any reason, including but not limited to a breach of these Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
        <p className="mb-4">
          These Terms and Conditions are governed by and construed in accordance with the laws of Uttar Pradesh, India, without regard to its conflict of law principles. Any legal action or proceeding related to the Service will be brought exclusively in the courts located in Bareilly, Uttar Pradesh.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about these Terms and Conditions, please contact us:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2">By email: contact@pulsezest.com</li>
          <li className="mb-2">By phone: 7248457558</li>
          <li className="mb-2">By mail: 69/2, Jagatpur Road, Pashupati Vihar Colony, Bareilly, Uttar Pradesh, 243006</li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
