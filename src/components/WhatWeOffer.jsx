// import card1 from "../assets/1.png";
// import card2 from "../assets/2.png";
// import card3 from "../assets/3.png";
// import { HiArrowCircleRight } from "react-icons/hi";

// function WhatWeOffer() {
//   return (
//     <section className="w-[100%] pt-[3.75rem] pb-[3.75rem]">
//       <div className="w-[80%] mx-auto   bg-white">
//         <div className="text-center ">
//           <h1 className="text-[2.5rem] md:text-[2.2rem] font-bold text-[#FF8211] uppercase tracking-wider font-bebas">
//             WHAT WE OFFER
//           </h1>
//         </div>
//         <div className="pt-[1rem] flex justify-center flex-col items-center poppins-medium">
//           <p className="text-[#333333] text-lg md:text-xl ">
//             Discover your perfect way to stay fit and connected.
//           </p>
//         </div>

//         {/* ......................................... */}
//         <div className="flex justify-center w-full pt-[2rem] gap-[1rem]">
//           {/* ----------------------------------------------------- */}
//           <div className="w-[32%] h-[265px] bg-[#ff7906] rounded-[1rem] overflow-hidden ">
//             <div className="flex justify-between ">
//               <div className="w-[36%]   ">
//                 <img
//                   src={card1}
//                   alt="img1"
//                   className="h-[265px] w-[155px] object-cover object-center"
//                 />
//               </div>
//               <div className="w-[64%] relative">
//                 <div className="flex justify-end pe-[1.5rem] pt-[1.5rem] ">
//                   <h3 className="poppins-semibold text-white text-[1.125rem] flex items-center gap-[0.5rem] ">
//                     Personal Trainers
//                     <HiArrowCircleRight className="text-[1.5rem] text-[#ffffaa] " />
//                   </h3>
//                 </div>
//                 <div className="absolute bottom-[27px] right-[8px]">
//                   <p className="text-[#ffd6b3] text-[1rem] poppins-regular leading-[24px] w-[213px] h-[76px]">
//                     Work one-on-one with pro trainers who create custom plans.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* ----------------------------------------------------- */}

//           <div className="w-[32%] h-[265px] bg-[#ff7906] rounded-[1rem] overflow-hidden relative">
//             <div className="w-[36%]  left-0 top-[-10px]  absolute ">
//               <img
//                 src={card2}
//                 alt="img1"
//                 className="h-[320px] w-[155px] object-cover object-center"
//               />
//             </div>
//             <div className="w-[64%] absolute right-0 top-0 h-full ">
//               <div className="flex justify-end pe-[1.5rem] pt-[1.5rem]">
//                 <h3 className="poppins-semibold text-white text-[1.125rem] flex items-center gap-[0.5rem]">
//                   Classes
//                   <HiArrowCircleRight className="text-[1.5rem] text-[#ffffaa]" />
//                 </h3>
//               </div>
//               <div className="absolute bottom-[27px] right-[8px]">
//                 <p className="text-[#ffd6b3] text-[1rem] poppins-regular leading-[24px] w-[213px] h-[76px]">
//                   Join live or online fitness sessions led by top certified
//                   coaches.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ----------------------------------------------------- */}

//           <div className="w-[32%] h-[265px] bg-[#ff7906] rounded-[1rem] overflow-hidden relative">
//             <div className="w-[36%] absolute left-0 top-[8px]">
//               <img
//                 src={card3}
//                 alt="img1"
//                 className="h-[265px] w-[155px] object-cover object-center"
//               />
//             </div>
//             <div className="w-[64%] absolute right-0 top-0 h-full">
//               <div className="flex justify-end pe-[1.5rem] pt-[1.5rem]">
//                 <h3 className="poppins-semibold text-white text-[1.125rem] flex items-center gap-[0.5rem]">
//                   Gyms
//                   <HiArrowCircleRight className="text-[1.5rem] text-[#ffffaa]" />
//                 </h3>
//               </div>
//               <div className="absolute bottom-[27px] right-[8px]">
//                 <p className="text-[#ffd6b3] text-[1rem] poppins-regular leading-[24px] w-[213px] h-[76px]">
//                   Find top gyms near you and compare facilities easily.
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* ----------------------------------------------------- */}
//           {/* ----------------------------------------------------- */}

//           <div className="w-[32%] h-[265px] bg-[#ff7906] rounded-[1rem] overflow-hidden relative">
//             <div className="w-[36%] absolute left-0 top-[8px]">
//               <img
//                 src={card3}
//                 alt="img1"
//                 className="h-[265px] w-[155px] object-cover object-center"
//               />
//             </div>
//             <div className="w-[64%] absolute right-0 top-0 h-full">
//               <div className="flex justify-end pe-[1.5rem] pt-[1.5rem]">
//                 <h3 className="poppins-semibold text-white text-[1.125rem] flex items-center gap-[0.5rem]">
//                   Gyms
//                   <HiArrowCircleRight className="text-[1.5rem] text-[#ffffaa]" />
//                 </h3>
//               </div>
//               <div className="absolute bottom-[27px] right-[8px]">
//                 <p className="text-[#ffd6b3] text-[1rem] poppins-regular leading-[24px] w-[213px] h-[76px]">
//                   Find top gyms near you and compare facilities easily.
//                 </p>
//               </div>
//             </div>
//           </div>
//           {/* ----------------------------------------------------- */}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default WhatWeOffer;
// -------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------

import { HiArrowCircleRight } from "react-icons/hi";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import cards from "../js/cardData";
import "../index.css";

function WhatWeOffer() {
  return (
    <section className="w-[100%] pt-[3.75rem] pb-[3.75rem]">
      <div className="w-[80%] mx-auto bg-white">
        <div className="text-center">
          <h1 className="text-[2.5rem] md:text-[2.2rem] font-bold text-[#FF8211] uppercase tracking-wider font-bebas">
            WHAT WE OFFER
          </h1>
        </div>
        <div className="pt-[1rem] flex justify-center flex-col items-center poppins-medium">
          <p className="text-[#333333] text-lg md:text-xl ">
            Discover your perfect way to stay fit and connected.
          </p>
        </div>

        <div className="pt-[2rem] w-full  ">
          <Swiper
            className="offers-swiper "
            modules={[Navigation, Pagination, Autoplay, FreeMode]}
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            speed={600}
            freeMode={true}
            loop={true}
            grabCursor={true}
            freeModeMomentum={false}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {cards.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="w-[100%] h-[265px] bg-[#ff7906] rounded-[1rem] overflow-hidden relative">
                  <div className="w-[36%] absolute left-0 top-[8px]">
                    <img
                      loading="lazy"
                      src={item.img}
                      alt={item.title}
                      className="h-[265px] w-[155px] object-cover object-center"
                    />
                  </div>
                  <div className="w-[64%] absolute right-0 top-0 h-full">
                    <div className="flex justify-end pe-[1.5rem] pt-[1.5rem]">
                      <h3 className="poppins-semibold text-white text-[1.125rem] flex items-center gap-[0.5rem]">
                        {item.title}
                        <HiArrowCircleRight className="text-[1.5rem] text-[#ffffaa] " />
                      </h3>
                    </div>
                    <div className="absolute bottom-[27px] right-[8px]">
                      <p className="text-[#ffd6b3] text-[1rem] poppins-regular leading-[24px] w-[213px] h-[76px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;
