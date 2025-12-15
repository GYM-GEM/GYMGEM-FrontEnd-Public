import CardForTrainers from "../components/Trainee/CardForTrainers";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Search, Filter, X } from "lucide-react";

function Trainers() {
  const [trainers, setTrainers] = useState([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [gender, setGender] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [specializationsList, setSpecializationsList] = useState([]);

  const fetchSpecializations = async () => {
    try {
      // Ensure the URL is correct based on your backend Setup
      const response = await axiosInstance.get(`/api/utils/specializations`);
      setSpecializationsList(response.data.results);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };

  const fetchTrainers = async () => {
    // Build Query Parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (specialization) params.append('specialization', specialization);
    if (gender && gender !== "all") params.append('gender', gender);
    if (serviceLocation && serviceLocation !== "all") params.append('location', serviceLocation);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);

    try {
      const response = await axiosInstance.get(`/api/trainers/list?${params.toString()}`);
      setTrainers(response.data);
    } catch (error) {
      console.error("Error fetching trainers:", error);
    }
  };

  // Fetch specializations on mount
  useEffect(() => {
    fetchSpecializations();
  }, []);

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTrainers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, specialization, gender, serviceLocation, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearchQuery("");
    setSpecialization("");
    setGender("");
    setServiceLocation("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-foreground">
      <Navbar />
      <section className="relative w-full pb-20">
        {/* Hero Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
          <header className="space-y-6 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-800 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-600 mr-2 animate-pulse"></span>
              EXPERT TRAINERS
            </div>

            <h1 className="font-bebas text-5xl tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              FIND YOUR PERFECT <span className="text-[#ff8211]">COACH</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Connect with certified professionals who design personalized programs aligned with your goals, pace, and lifestyle.
            </p>
          </header>

          {/* Search and Advanced Filters */}
          <div className="sticky top-4 z-30 mx-auto w-full max-w-5xl rounded-2xl bg-white/80 p-4 shadow-xl shadow-gray-200/50 backdrop-blur-xl border border-white/20 ring-1 ring-black/5 transition-all duration-300">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trainers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium placeholder:text-gray-400 focus:border-[#ff8211] focus:outline-none focus:ring-4 focus:ring-[#ff8211]/10 transition-all shadow-sm"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:hidden transition-colors"
                aria-label="Toggle filters"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Grid */}
            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 ${showFilters ? 'block animate-in slide-in-from-top-2' : 'hidden sm:grid'}`}>

              {/* Specialization - Spans 3 columns */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-[#ff8211] focus:outline-none focus:ring-2 focus:ring-[#ff8211]/10"
                >
                  <option value="">All Specializations</option>
                  {specializationsList.map((spec) => (
                    <option key={spec.id} value={spec.name}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location - Spans 3 columns */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Location</label>
                <select
                  value={serviceLocation}
                  onChange={(e) => setServiceLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-[#ff8211] focus:outline-none focus:ring-2 focus:ring-[#ff8211]/10"
                >
                  <option value="">Any Location</option>
                  <option value="online">Online</option>
                  <option value="offline">In-Person</option>
                  <option value="both">Hybrid</option>
                </select>
              </div>

              {/* Gender - Spans 2 columns */}
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium text-gray-700 focus:border-[#ff8211] focus:outline-none focus:ring-2 focus:ring-[#ff8211]/10"
                >
                  <option value="">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Price Range - Spans 3 columns */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Hourly Rate ($)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-[#ff8211] focus:outline-none focus:ring-2 focus:ring-[#ff8211]/10"
                  />
                  <span className="text-gray-300">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2.5 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:border-[#ff8211] focus:outline-none focus:ring-2 focus:ring-[#ff8211]/10"
                  />
                </div>
              </div>

              {/* Clear Filters (Mobile only, or separate button?) */}
              {/* For desktop, maybe a small clean icon or button? Let's add a row below or integrated. */}
            </div>

            {/* Active Filter Badges / Reset */}
            {(searchQuery || specialization || gender || serviceLocation || minPrice || maxPrice) && (
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-xs font-medium text-gray-500">Active Filters</span>
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-8">
          <CardForTrainers trainers={trainers} />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Trainers;
