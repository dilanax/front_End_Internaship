import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold">Welcome to My Frontend Project</h2>
      </div>
    </>
  );
};

export default Home;
