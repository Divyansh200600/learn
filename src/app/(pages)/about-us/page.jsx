import Head from 'next/head';

export default function About() {
  return (
    <div className="min-h-screen bg-green-50">
      <Head>
        <title>About Us - PulseZest</title>
      </Head>
      <header className="bg-green-600 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">PulseZest</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to PulseZest, your ultimate destination for personalized learning experiences. We offer a wide range of courses designed to cater to your individual learning needs and goals.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Our Courses</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our courses are carefully crafted by industry experts to ensure you gain practical and valuable knowledge. Whether you are looking to upskill, reskill, or explore a new field, we have the right course for you.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">One-on-One Tutoring</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At PulseZest, we believe in the power of personalized learning. Our one-on-one tutoring sessions are designed to provide you with focused attention and tailored instruction, helping you achieve your learning objectives efficiently and effectively.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-4">Join Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ready to embark on your learning journey with PulseZest? Explore our courses and book a one-on-one session with our expert tutors today. Together, we'll help you reach new heights of success.
          </p>
        </section>
      </main>
      <footer className="bg-green-600 text-white p-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} PulseZest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
