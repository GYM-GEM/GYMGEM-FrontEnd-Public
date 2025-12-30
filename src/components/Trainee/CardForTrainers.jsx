import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

function CardForTrainers({ trainers }) {
  return (
    <section className="w-full pb-20">
      <div className="mx-auto grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {trainers && trainers.length > 0 ? (
          trainers.map((item) => {
            // Get price from first specialization or default
            const price = item.rate
              ? `${item.rate} GEMs`
              : "Contact";

            return (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 border border-gray-100"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                  <img
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    src={item.profile_picture || "https://ui-avatars.com/api/?name=" + item.name + "&background=FF8211&color=fff"}
                    alt={item.name}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                  {/* Service Location Badge */}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {item.specializations?.slice(0, 1).map((s, idx) => (
                      <span key={idx} className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md 
                        ${s.service_location.toLowerCase() === 'online' ? 'bg-green-500/90 text-white' :
                          s.service_location.toLowerCase() === 'offline' ? 'bg-blue-500/90 text-white' :
                            'bg-purple-500/90 text-white'}`}>
                        {s.service_location === 'both' ? 'Hybrid' : s.service_location}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bebas text-2xl tracking-wide text-gray-900 group-hover:text-[#ff8211] transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm font-bold text-[#ff8211]">
                        {price}
                        <span className="text-xs font-normal text-gray-400">/session</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      {item.specializations?.slice(0, 3).map((s, i) => (
                        <span key={i} className="rounded-md bg-gray-50 px-2 py-1 border border-gray-100 text-gray-600">
                          {s.name || "Trainer"}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm text-gray-500 leading-relaxed">
                    {item.bio || "Certified personal trainer dedicated to helping you achieve your fitness goals through personalized programs."}
                  </p>

                  <div className="mt-auto">
                    <Link
                      to={`/trainer-profile/${item.id}`}
                      className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-bold text-white transition-all hover:bg-[#ff8211]"
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-gray-50 p-6">
              <MapPin className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No trainers found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default CardForTrainers;
