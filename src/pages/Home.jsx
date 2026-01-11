import HeroSc from "../components/Home/HeroSc.jsx";
import WhatWeOffer from "../components/Home/WhatWeOffer.jsx";
import ForTrainees from "../components/Home/ForTrainees.jsx";
import ForTrainers from "../components/Home/ForTrainers.jsx";
import NutritionSec from "../components/Home/Ai-Features.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";

function Home() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <HeroSc />
      <WhatWeOffer />
      <NutritionSec />
      <ForTrainees />
      <ForTrainers />
      <Footer />
    </div>
  );
}

export default Home;
