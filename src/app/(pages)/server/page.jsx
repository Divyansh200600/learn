'use client'

import React from 'react';
import { OrbitingCirclesDemo } from '../../../components/server/orbit'; // Ensure correct path
import { AnimatedBeamDemo } from '../../../components/server/beam'; // Ensure correct path
import Terminal from '../../../components/server/terminal'; // Ensure correct path
import Hero from '../../../components/server/heroSection'; // Ensure correct path
import Footer1 from '../../../components/server/footer';
import Footer from '../../../components/footer/page';
import ServerCard from '../../../components/server/ServerInfo';

const ServerPage = () => {
  const containerRef = React.useRef(null);
  const fromRef = React.useRef(null);
  const toRef = React.useRef(null);

  return (
    <div>
        <Hero />
       
    <div style={{ padding: '20px' }}>
      {/* Hero Section */}
    
      
      <div
        style={{
          textAlign: 'center',
          margin: '40px 0',
        }}
      >
       <ServerCard/>
      </div>
      <OrbitingCirclesDemo />

      <div ref={containerRef} style={{ position: 'relative', height: '500px', marginTop: '20px' }}>
        <div ref={fromRef} style={{
          position: 'absolute',
          top: '50px',
          left: '50px',
          width: '20px',
          height: '20px',
          backgroundColor: 'blue',
          borderRadius: '50%', // Circular appearance
        }} />
        <div ref={toRef} style={{
          position: 'absolute',
          top: '200px',
          left: '200px',
          width: '20px',
          height: '20px',
          backgroundColor: 'red',
          borderRadius: '50%', // Circular appearance
        }} />
          <h1 style={{
        fontSize: '46px',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #6a1b9a, #f06292)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(255, 105, 180, 0.8)',
        margin: '20px 0'
      }}>
        Data Flow in Server
      </h1>
        <AnimatedBeamDemo
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <div style={{ width: '80%', maxWidth: '800px' }}>
          <br></br>
          <br></br>
          <br></br>
          <Terminal />
          
        </div>
       
      </div>
    </div>
    <Footer1/>
    <Footer/>
    </div>
  );
};

export default ServerPage;
