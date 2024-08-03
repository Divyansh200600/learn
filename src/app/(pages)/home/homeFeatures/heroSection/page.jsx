'use client';
import { useEffect, useRef, useState } from "react";
import "./HeroSection.css"; // Import your custom CSS for styling

const HeroSection = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 }); // Initialize off-screen
    const heroSectionRef = useRef(null);
    const coursesRef = useRef(null);

    const spiderStyle = {
        top: `${mousePosition.y}px`,
        left: `${mousePosition.x}px`,
        backgroundImage: "url('https://clipart-library.com/images/kiMb8barT.png')", // Replace with the URL of your spider or spider web image
    };

    useEffect(() => {
        const handleMouseMove = (event) => {
            const rect = heroSectionRef.current.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            
            // Adjust the spider position to be closer to the cursor
            const adjustedX = offsetX - 25; // Offset spider to center
            const adjustedY = offsetY - 25; // Offset spider to center
            
            setMousePosition({
                x: adjustedX,
                y: adjustedY
            });
        };
        
        const heroSection = heroSectionRef.current;
        heroSection.addEventListener("mousemove", handleMouseMove);

        return () => {
            heroSection.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const handleExploreCourses = () => {
        if (coursesRef.current) {
            // Calculate the position of the courses section relative to the top of the document
            const coursesPosition = coursesRef.current.getBoundingClientRect().top + window.scrollY;

            // Scroll to the specific position (e.g., 50px from the top)
            window.scrollTo({
                top: coursesPosition - 0, // Adjust the offset as needed
                behavior: "smooth" // Smooth scrolling
            });
        }
    };

    return (
        <>
        <div className="hero-section" ref={heroSectionRef}>
            <div className="ocean">
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
            <div className="content-box">
                <h1 className="hero-title">Welcome To King of Learning</h1>
                <p className="hero-text">Ready To Dive For Explore More</p>
                <button className="hero-button" onClick={handleExploreCourses}>Explore Courses</button>
                <div className="spider" style={spiderStyle}></div>
            </div>
        </div>
        <div ref={coursesRef} className="courses-section">
          {/* Content of the courses section goes here */}
        </div>
        </>
    );
};

export default HeroSection;
