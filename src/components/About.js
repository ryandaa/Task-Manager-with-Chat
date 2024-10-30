import React from 'react';
import familyImage from '../assets/family.svg';

const About = () => {
  return (
    <div className="p-4 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold mb-2 text-left md:text-left">About</h2>
        <p className>This app helps families stay organized and on top of their daily tasks by allowing each member to create, track, and collaborate on responsibilites in one central place. No matter the errand, chore, or task, it will track. </p>
      </div>
      <img src={familyImage} alt="Family" className="w-48 h-48 md:w-64 md:h-64" />
    </div>
  );
};

export default About;
