import {
  HiArrowCircleRight,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import cards from "../../js/cardData";
import "../../index.css";
import { useEffect, useRef, useState } from "react";

function WhatWeOffer() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-background py-16">
      <div className="mx-auto w-[80%]  ">
        <div
          className={`text-center transition-all duration-700 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 className="font-bebas text-3xl tracking-tight text-foreground sm:text-4xl text-[#FF8211]">
            What we offer
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg text-[#555555]">
            Discover calm, purposeful ways to stay fit and connected to your
            community.
          </p>
        </div>

        <div
          className={`mt-12 w-full transition-all duration-700 delay-200 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Swiper
            className="offers-swiper"
            modules={[Navigation, Pagination, Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            speed={700}
            freeMode
            loop
            grabCursor
            freeModeMomentum={false}
            breakpoints={{
              640: { slidesPerView: 1.1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {cards.map((item, index) => (
              <SwiperSlide key={index}>
                <article className="relative flex h-72 flex-col overflow-hidden rounded-2xl  border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02]">
                  <div className="absolute inset-y-4 left-4 w-32 overflow-hidden rounded-xl ">
                    <img
                      loading="lazy"
                      src={item.img}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-[9rem] flex h-full flex-col justify-between p-5">
                    <div>
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground text-[#FF8211]">
                        {item.title}
                        <HiArrowCircleRight className="text-primary" />
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Tailored support • Flexible access • Measurable results
                    </span>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default WhatWeOffer;
