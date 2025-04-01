import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepageImage from './images/homebackground.png'; 

const Home = () => {
  return (
    <>
      <div 
        className="container-fluid p-0" 
        style={{ 
          position: 'relative', 
          width: '100vw', 
          height: '100vh', 
          overflow: 'hidden' 
        }}
      >
        <img 
          src={homepageImage} 
          alt="Arul Online Electromart" 
          className="img-fluid" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }} 
        />
      </div>
    </>
  );
};

export default Home;
