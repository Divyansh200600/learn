"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "./ani.json"; // Import your Lottie animation JSON file

const BootCamp = () => {
  const [currentVideo, setCurrentVideo] = useState({
    title: "Rishab Chauhan",
    by: "Position: CEO PulseZest",
    src:
      "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/Firebase%2FFirebase%20Connection%20with%20Flutter.mp4?alt=media&token=0bd21013-6eee-4674-8967-e56fa6ad0609",
  });

  const heroSectionStyle = {
    backgroundColor: "#001219", // Light lime blue background color
    minHeight: "100vh", // Full viewport height
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px", // Added padding for spacing
    position: "relative",
  };

  const mainContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "1200px", // Adjust maximum width of the main container
    margin: "0 auto", // Center align horizontally
    marginTop: "40px", // Add margin top for spacing
    padding: "20px",
  };

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // Your imported animation data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lottieContainerStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "20px", // Add margin right for spacing
  };

  const videoCardStyle = {
    flex: "1 1 400px", // Flexbox properties for responsive sizing
    maxWidth: "600px",
    border: "2px solid #333", // Border styling
    borderRadius: "8px", // Rounded corners
    overflow: "hidden", // Hide overflow content
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
    margin: "20px", // Adjust margin for spacing
    position: "relative",
  };

  const boxContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0", // Adjust margin for spacing top and bottom
    gap: "20px",
  };

  const boxStyle = {
    width: "160px", // Adjust width of each box
    height: "150px", // Adjust height of each box
    backgroundColor: "#333", // Background color of each box (adjust as needed)
    color: "#fff", // Text color (white)
    borderRadius: "8px", // Rounded corners
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer", // Add cursor pointer for clickable effect
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold", // Make text bold
    position: "relative", // Enable relative positioning
    overflow: "hidden", // Hide overflow for bubbly effect
  };

  const boxHoverStyle = {
    boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)", // Glowing effect on hover
    animation: "bubbly 1s ease-in-out infinite", // Apply bubbly animation
  };

  const box1Clicked = () => {
    setCurrentVideo({
      title: "24/7 Doubt Support",
      by: "Piyush Sir   ",
      src: "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/GitHub%2FGitHub%20First%20Part.mp4?alt=media&token=1dae370b-575c-4b99-8baf-c80a95f78c4a",
    });
  };

  const box2Clicked = () => {
    setCurrentVideo({
      title: "Live Webinar & BootCamps",
      by: "Rishab Sir",
      src: "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/javaScript%2FConditional%20Statements%20-.mp4?alt=media&token=2ded211c-a04c-4d4d-a931-59202c53e40c",
    });
  };

  const box3Clicked = () => {
    setCurrentVideo({
      title: "Projects Assistance",
      by: "Tech Chauhan",
      src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  };

  return (
    <div style={heroSectionStyle}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ fontSize: "3rem", color: "#333", marginBottom: "20px" }}
      >
      <h1 className="text-5xl mx-auto font-bold text-white mb-0 text-center">Why Choose Us </h1>
      </motion.h1>

      <div style={mainContainerStyle}>
        {/* Lottie Animation */}
        <div style={{ ...lottieContainerStyle }}>
          <Lottie
            options={animationOptions}
            height={300} // Adjust height of animation
            width={300} // Adjust width of animation
          />
        </div>

       {/* Video Card */}
        <div style={videoCardStyle}>
          <iframe
            title={currentVideo.title}
            width="100%"
            height="250"
            src={currentVideo.src} // Dynamic source based on clicked box
            frameBorder="0"
            allowFullScreen
            style={{ borderRadius: "8px 8px 0 0", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
          ></iframe>
          <div style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "1.8rem", margin: "0", color: "#fff", fontWeight: "bold" }}>{currentVideo.title}</h2>
            <p style={{ fontSize: "1.2rem", margin: "5px 0 0", color: "#ccc" }}>{currentVideo.by}</p>
          </div>
        </div>

        {/* Three Rectangle Boxes */}
        <div style={boxContainerStyle}>
          <div
            style={{ ...boxStyle, backgroundColor: "#005f73" }}
            onClick={box1Clicked}
          >
            24/7 Doubt Support
          </div>
          <div
            style={{ ...boxStyle, backgroundColor: "#0a9396" }}
            onClick={box2Clicked}
          >
            Live Webinar & BootCamps
          </div>
          <div
            style={{ ...boxStyle, backgroundColor: "#94d2bd" }}
            onClick={box3Clicked}
          >
            Projects Assistance
          </div>
        </div>
      </div>
    </div>
  );
};

export default BootCamp;
