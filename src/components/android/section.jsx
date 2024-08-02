import React from 'react';
import ReactPlayer from 'react-player';

const Section = () => {
    return (
       
        
          
        <div style={{ 
            display: 'flex',
            width:'1344px',

            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#fff' // White background for the surrounding area
        }}>
                <h1>Section</h1>
            <div style={{
                position: 'relative',
                width: '80vw', // Adjust width as needed
                height: '100vh', // Adjust height as needed
                backgroundColor: '#000', // Black background for the video container
                borderRadius: '10px', // Optional: Rounded corners
                overflow: 'hidden', // Ensures video doesn't overflow
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)' // Optional: Adds shadow for depth
            }}>
                <ReactPlayer
                    url="https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/divyansh-store%2Fapp%20of%20learning%2FsectionAndroid.mp4?alt=media&token=570161e8-8765-41c0-add3-e39934333072"
                    playing={true}
                    controls={false}
                    width="120%"
                    height="120%"
                    loop={true}
                    muted={true}
                    playbackRate={2} // Sets the video speed to 1.5x
                />
                <style jsx>{`
                    div :global(video) {
                        object-fit: cover;
                        width: 120%;
                        height: 120%;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                `}</style>
            </div>
        </div>
       
    );
};

export default Section;