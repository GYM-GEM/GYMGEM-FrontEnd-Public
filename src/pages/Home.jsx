import HeroSc from "../components/HeroSc";
import WhatWeOffer from "../components/WhatWeOffer.jsx";
import ForTrainees from "../components/ForTrainees.jsx";
import ForTrainers from "../components/ForTrainers.jsx";
import NutritionSec from "../components/NutritionSec.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSc />
      <WhatWeOffer />
      <ForTrainees />
      <ForTrainers />
      <NutritionSec />
      <Footer />
    </>
  );
}

export default Home;
