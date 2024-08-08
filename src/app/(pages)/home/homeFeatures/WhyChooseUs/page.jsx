"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import animationData from "./ani.json"; // Import your Lottie animation JSON file

const WhyChooseUs = () => {
  const [currentVideo, setCurrentVideo] = useState({
    title: "Rishab Chauhan",
    by: "Position: CO-Founder",
    src:
      "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/Firebase%2FFirebase%20Connection%20with%20Flutter.mp4?alt=media&token=0bd21013-6eee-4674-8967-e56fa6ad0609",
  });

  const heroSectionStyle = {
    backgroundColor: "#001219",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    position: "relative",
  };

  const mainContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "40px",
    padding: "20px",
    position: "relative",
  };

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const lottieContainerStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "20px",
  };

  const videoCardStyle = {
    flex: "1 1 400px",
    maxWidth: "600px",
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    margin: "20px",
    border: "8px solid #ffffff", // White border
    backgroundColor: "#000", // Ensure background color is black to contrast with the border
  };
  

  const videoOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "opacity 0.3s",
    opacity: 0,
    borderRadius: "12px", // Ensure overlay corners match the card
  };
  

  const videoOverlayHoverStyle = {
    opacity: 1,
  };

  const boxContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
    gap: "20px",
  };

  const boxStyle = {
    width: "160px",
    height: "150px",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    position: "relative",
    overflow: "hidden",
  };

  const boxHoverStyle = {
    boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)",
    animation: "bubbly 1s ease-in-out infinite",
  };

  const box1Clicked = () => {
    setCurrentVideo({
      title: "24/7 Doubt Support",
      by: "Piyush Sir",
      src: "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/GitHub%2FGitHub%20First%20Part.mp4?alt=media&token=1dae370b-575c-4b99-8baf-c80a95f78c4a",
    });
  };

  const box2Clicked = () => {
    setCurrentVideo({
      title: "Live Webinar & BootCamps",
      by: "Amit Sir",
      src: "https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/javaScript%2FConditional%20Statements%20-.mp4?alt=media&token=2ded211c-a04c-4d4d-a931-59202c53e40c",
    });
  };

  const box3Clicked = () => {
    setCurrentVideo({
      title: "Projects Assistance",
      by: "Divyansh Chauhan",
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
        <h1 className="text-5xl mx-auto font-bold text-white mb-0 text-center">Why Choose Us</h1>
      </motion.h1>

      <div style={mainContainerStyle}>
        {/* Lottie Animation */}
        <div style={{ ...lottieContainerStyle }}>
          <Lottie
            options={animationOptions}
            height={300}
            width={300}
          />
        </div>

        {/* Video Card */}
        <div style={videoCardStyle}>
          <div style={{ position: "relative" }}>
            <iframe
              title={currentVideo.title}
              width="100%"
              height="250"
              src={currentVideo.src}
              frameBorder="0"
              allowFullScreen
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                position: "relative",
                zIndex: 1,
              }}
            ></iframe>
            <div
              style={{
                ...videoOverlayStyle,
                opacity: 0,
                zIndex: 2,
                transition: "opacity 0.3s",
              }}
              className="video-overlay"
            >
              <button
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  border: "none",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                className="play-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="white"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
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

export default WhyChooseUs;
