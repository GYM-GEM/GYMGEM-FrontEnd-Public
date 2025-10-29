import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
function Trainees() {
  return (
    <>
      <Navbar />
      <section className="text-center py-20 h-dvh bg-[#80aef2d9]">
        <h1 className="text-4xl font-bold mb-4 text-purple-500">Trainees</h1>
        <p className="text-lg text-gray-600">This is the Trainees page.</p>
      </section>
      <Footer />
    </>
  );
}

export default Trainees;
