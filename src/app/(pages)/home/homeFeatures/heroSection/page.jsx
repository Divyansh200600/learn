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
            const coursesSectionTop = coursesRef.current.offsetTop - -400; // Adjusted scroll position, subtracting 50 for padding or margin
            window.scrollTo({
                top: coursesSectionTop,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="hero-section" ref={heroSectionRef}>
            <div className="ocean">
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
            <div className="content-box">
                <h1 className="hero-title">Welcome To King Learning</h1>
                <p className="hero-text">Ready To Dive For Explore More</p>
                <button className="hero-button" onClick={handleExploreCourses}>Explore Courses</button>
                <div className="spider" style={spiderStyle}></div>
            </div>
        </div>
    );
};

export default HeroSection;
