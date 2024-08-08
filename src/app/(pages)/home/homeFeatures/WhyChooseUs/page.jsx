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

  const [hoveredBox, setHoveredBox] = useState(null); // State to track which box is hovered

  const heroSectionStyle = {
    backgroundColor: "#001219",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  };

  const headingStyle = {
    fontSize: "3rem",
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center",
  };

  const mainContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-start",
    maxWidth: "1200px",
    width: "100%",
    margin: "0 auto",
    gap: "20px",
    flexWrap: "wrap",
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
    flex: "1 1 300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const videoCardStyle = {
    flex: "1 1 500px",
    maxWidth: "500px",
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
    margin: "20px",
    border: "8px solid #ffffff", // White border
    backgroundColor: "#000", // Ensure background color is black to contrast with the border
  };

  const boxContainerStyle = {
    flex: "1 1 300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    position: "relative",
    overflow: "hidden",
  };

  const boxHoverStyle = {
    transform: "scale(1.05)", // Scale up on hover
    boxShadow: "0px 8px 16px rgba(255, 255, 255, 0.4)", // Brighter shadow
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
        style={headingStyle}
      >
        Why Choose Us
      </motion.h1>

      <div style={mainContainerStyle}>
        {/* Lottie Animation */}
        <div style={lottieContainerStyle}>
          <Lottie
            options={animationOptions}
            height={300}
            width={300}
          />
        </div>

        {/* Video Card */}
        <div style={videoCardStyle}>
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
            }}
          ></iframe>
          <div style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "1.8rem", margin: "0", color: "#fff", fontWeight: "bold" }}>{currentVideo.title}</h2>
            <p style={{ fontSize: "1.2rem", margin: "5px 0 0", color: "#ccc" }}>{currentVideo.by}</p>
          </div>
        </div>

        {/* Three Rectangle Boxes */}
        <div style={boxContainerStyle}>
          <div
            style={{
              ...boxStyle,
              ...(hoveredBox === "box1" ? boxHoverStyle : {}),
              backgroundColor: "#005f73",
            }}
            onClick={box1Clicked}
            onMouseEnter={() => setHoveredBox("box1")}
            onMouseLeave={() => setHoveredBox(null)}
          >
            24/7 Doubt Support
          </div>
          <div
            style={{
              ...boxStyle,
              ...(hoveredBox === "box2" ? boxHoverStyle : {}),
              backgroundColor: "#0a9396",
            }}
            onClick={box2Clicked}
            onMouseEnter={() => setHoveredBox("box2")}
            onMouseLeave={() => setHoveredBox(null)}
          >
            Live Webinar & BootCamps
          </div>
          <div
            style={{
              ...boxStyle,
              ...(hoveredBox === "box3" ? boxHoverStyle : {}),
              backgroundColor: "#94d2bd",
            }}
            onClick={box3Clicked}
            onMouseEnter={() => setHoveredBox("box3")}
            onMouseLeave={() => setHoveredBox(null)}
          >
            Projects Assistance
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
