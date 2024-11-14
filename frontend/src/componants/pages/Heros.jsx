import React from "react";
import Navbar from "./Navbar";
import { Carousel } from "flowbite-react";

// Import des images pour chaque slide
import logo from '../../assets/slide1.jpg';
import logo1 from '../../assets/slide2.jpg';
import logo2 from '../../assets/slide3.jpg';
import logo4 from '../../assets/slide4.jpg';

const Heros = () => {
  return (
    <section className="relative overflow-hidden">
      <Navbar />
      <div className=" h-100 min-h-full sm:h-200 xl:h-96 2xl:h-[800px] w-full"> {/* Ajustement des hauteurs */}
        <Carousel className="w-full mx-auto">
          {/* Slide 1 */}
          <div
            className="relative flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url(${logo})`, // Image de fond du Slide 1
            }}
          >
            <h2 className="absolute bottom-10 left-0 right-0 text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center drop-shadow-md">
              Bienvenue sur le Portail
            </h2>
          </div>

          {/* Slide 2 */}
          <div
            className="relative flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url(${logo1})`, // Image de fond du Slide 2
            }}
          >
            <h2 className="absolute bottom-10 left-0 right-0 text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center drop-shadow-md">
              Direction des Systèmes d'Information
            </h2>
          </div>

          {/* Slide 3 */}
          <div
            className="relative flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url(${logo2})`, // Image de fond du Slide 3
            }}
          >
            <h2 className="absolute bottom-10 left-0 right-0 text-xl sm:text-2xl lg:text-3xl font-medium text-white text-center drop-shadow-md">
              Pour toute assistance ou renseignement,<br />
              veuillez contacter le numéro +261 38 0981830 ou +261 380981830
            </h2>
          </div>

          {/* Slide 4 */}
          <div
            className="relative flex h-full items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `url(${logo4})`, // Image de fond du Slide 4
            }}
          >
            <h2 className="absolute bottom-10 left-0 right-0 text-sm sm:text-lg lg:text-2xl font-light text-white text-center drop-shadow-md">
              Copyright © P A C. All rights reserved. September 2020
            </h2>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Heros;
