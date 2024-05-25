import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Home.css';
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import heroImage from "../assets/hero.jpg";

const Home = () => {
  return (
   <>
    <div className="container mx-auto p-4 grid grid-cols-2 gap-4">
      {/* Left side content */}
      <div className="mt-56">
        <h2 className="text-3xl font-bold mb-4">Welcome to Our Store</h2>
        <p className="text-lg mb-6 ">An ethereal online shopping paradise offering limitless delights, where dreams meet reality in a digital haven of endless possibilities.Explore our wide range of products and find the perfect items for you.</p>
        <button className='bg-gray-800 text-white px-10 py-4 rounded-lg'>Explore Now</button>
        {/* Add any other content you want to display here */}
      </div>
      {/* Right side image */}
      <div>
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover"/>
      </div>
    </div>
    <div className="container mx-auto p-4 h-80">
      <Carousel showArrows={true} autoPlay={true} infiniteLoop={true} className="carousel">
        <div>
          <img src={banner1} alt="Product 1" />
          <p className="legend">Product 1</p>
        </div>
        <div>
          <img src={banner2} alt="Product 2" />
          <p className="legend">Product 2</p>
        </div>
        <div>
          <img src={banner3} alt="Product 3" />
          <p className="legend">Product 3</p>
        </div>
      </Carousel>
    </div>
   </>
  );
};

export default Home;
