import React, { useState, useEffect } from 'react';
const images = [
  '/heroSection1.jpg',
  '/heroSection2.jpg',
  '/heroSection3.jpg',
  '/heroSection4.jpg',
  '/heroSection5.jpg',
]

const HeroSection = () => {
    const [current, setCurrent] = useState(0);   //to keep track of the current image index in the slider
    const length = images.length;

    useEffect(() => {    //Used to automatically change the image every 2 seconds.
        const interval = setInterval(() => {   //Automatically changes the current slide every 2 seconds
            setCurrent(prev => (prev + 1) % length);  //Cycles through slides.
        }, 2000); // 2 seconds per slide

        return () => clearInterval(interval); // Cleans up the interval when the component unmounts
    }, [length]);
//   Slider 
    return (
        <div className="slider-container">
            {images.map((img, index) => (
                <div
                    className={index === current ? 'slide active' : 'slide'}
                    key={index}
                >
                    {index === current && (
                        <img src={img} alt={`slide-${index}`} className="slider-image" />
                    )}
                </div>
            ))}
        </div>
    );
};

export default HeroSection;