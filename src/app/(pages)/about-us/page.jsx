import Head from 'next/head';
import Footer from '../../../components/footer/page';

export default function About() {
  return (
    <div className="min-h-screen bg-green-50">
      <Head>
        <title>About Us - PulseZest</title>
      </Head>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-4xl font-semibold text-green-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to PulseZest, a leading software development company dedicated to creating innovative solutions in the fields of Education, Financial services, and B2B software. Our expertise lies in developing dynamic websites, landing pages, and powerful applications tailored to meet the needs of our clients. We are passionate about driving growth and efficiency through cutting-edge technology.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            PulseZest Learning, a sub-domain of PulseZest, is an educational platform where we empower students with the skills and knowledge required to excel in modern technology. We offer a range of courses designed to teach students about the latest advancements in React, Flutter, Android development, and more.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Our Courses</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our courses are meticulously crafted by industry experts to ensure that learners gain practical, real-world skills. Whether you&apos;re looking to upskill, reskill, or explore a new field, PulseZest Learning provides you with the resources and guidance to succeed.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">One-on-One Tutoring</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At PulseZest, we understand the value of personalized learning. Our one-on-one tutoring sessions are designed to give you focused attention and customized instruction, ensuring that you achieve your learning goals efficiently and effectively.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Meet Our Leadership</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-green-700">Rishab Chauhan - Founder</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Rishab Chauhan, the visionary behind PulseZest, has a passion for technology and innovation. His leadership and expertise have driven the company to the forefront of software development, creating impactful solutions across various industries.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-green-700">Piyush Srivastava - Co-Founder</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Piyush Srivastava, the co-founder of PulseZest, brings a wealth of experience in business strategy and technology. His dedication to excellence ensures that PulseZest continues to deliver high-quality solutions that meet the evolving needs of our clients.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-green-700">Divyansh Chauhan - CTO</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Divyansh Chauhan, as the Chief Technology Officer, oversees the technological direction of PulseZest. His deep technical knowledge and innovative thinking are instrumental in driving the company&apos;s success and ensuring that our products remain at the cutting edge of technology.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Join Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ready to embark on your learning journey with PulseZest? Explore our courses and book a one-on-one session with our expert tutors today. Together, we&apos;ll help you reach new heights of success.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
