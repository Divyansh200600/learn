"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const WebinarPage = () => {
  const [timeLeft, setTimeLeft] = useState({});
  
  // Example date for the webinar
  const webinarDate = new Date("2024-09-15T18:00:00");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const distance = webinarDate - now;
      
      if (distance < 0) {
        clearInterval(intervalId);
        setTimeLeft({});
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [webinarDate]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="hero bg-cover bg-center h-screen flex items-center justify-center relative" style={{ backgroundImage: "url('/webinar-bg.jpg')" }}>
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center bg-black bg-opacity-50 p-10 rounded-lg"
        >
          <h1 className="text-5xl font-bold mb-6">Join Our Exclusive Webinar</h1>
          <p className="text-lg mb-6">Unlock the secrets to mastering [Topic] with our expert speakers.</p>
          <motion.div 
            className="countdown bg-gray-800 p-4 rounded-lg inline-block text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl mb-2">Starts In</h2>
            <div className="flex justify-center space-x-4">
              <div>
                <span className="text-4xl font-bold">{timeLeft.days || "0"}</span>
                <p>Days</p>
              </div>
              <div>
                <span className="text-4xl font-bold">{timeLeft.hours || "00"}</span>
                <p>Hours</p>
              </div>
              <div>
                <span className="text-4xl font-bold">{timeLeft.minutes || "00"}</span>
                <p>Minutes</p>
              </div>
              <div>
                <span className="text-4xl font-bold">{timeLeft.seconds || "00"}</span>
                <p>Seconds</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Registration Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gray-900 p-10 rounded-lg shadow-lg"
          >
            <h2 className="text-4xl font-bold mb-6 text-center">Register Now</h2>
            <p className="text-lg text-center mb-6">Secure your spot in this game-changing webinar.</p>
            <form className="max-w-xl mx-auto">
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                <input type="text" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                <input type="email" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">Register Now</button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Agenda Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-center mb-10">Webinar Agenda</h2>
            <ul className="space-y-8">
              <li className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold">Introduction to [Topic]</h3>
                <p className="text-gray-300 mt-2">
  A brief overview of what you&apos;ll learn in this session.
</p>
              </li>
              <li className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold">Deep Dive into [Subtopic]</h3>
                <p className="text-gray-300 mt-2">In-depth analysis and practical examples.</p>
              </li>
              <li className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold">Q&A Session</h3>
                <p className="text-gray-300 mt-2">Get answers to your questions directly from our experts.</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebinarPage;
