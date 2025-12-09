import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import gym1 from "../assets/pexels1.jpg";
import gym2 from "../assets/pexels2.jpg";
import gym3 from "../assets/pexels3.jpg";
import { Users, TrendingUp, ShieldCheck, Heart } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src={gym1} alt="Background" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-400 backdrop-blur-md border border-orange-500/20">
            EST. 2024
          </span>
          <h1 className="font-bebas text-5xl tracking-tight text-white sm:text-7xl lg:text-8xl">
            MORE THAN JUST <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">A PLATFORM</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl leading-relaxed">
            We are the calm hub where trainers, trainees, gyms, and stores converge.
            A unified ecosystem designed to make progress feel natural, transparent, and inevitable.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="space-y-8">
              <h2 className="font-bebas text-4xl text-gray-900 sm:text-5xl">
                A SHARED VISION FOR <span className="text-orange-600">GROWTH</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  GymGem started with a simple intention: to dismantle the barriers between ambition and achievement.
                  We noticed that the fitness world was fragmented—trainers struggling with admin, trainees lost in noise,
                  and gyms disconnected from their communities.
                </p>
                <p>
                  We built a bridge. By bringing every role into one balanced platform, we create mindful workflows
                  that support long-term consistency. Every interaction on GymGem is designed to be calm,
                  transparent, and focused on the next milestone.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-12">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">10k+</p>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Active Users</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">500+</p>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Certified Trainers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">98%</p>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Grid */}
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src={gym2}
                alt="Training"
                className="rounded-3xl object-cover h-64 w-full transform translate-y-8 lg:translate-y-12 shadow-2xl"
              />
              <img
                src={gym3}
                alt="Nutrition"
                className="rounded-3xl object-cover h-64 w-full shadow-2xl"
              />
              {/* Decorative element */}
              <div className="absolute -z-10 -bottom-8 -left-8 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Values */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-bebas text-4xl text-gray-900 sm:text-5xl">OUR CORE <span className="text-orange-600">VALUES</span></h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">The principles that guide every feature we build and every connection we foster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Community */}
            <div className="md:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bebas text-2xl text-gray-900">Community First</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Relationships are the bedrock of fitness. We prioritize features that deepen connections—whether it's
                direct chat between coach and client, or community boards for gyms. We believe that accountability
                thrives in company.
              </p>
            </div>

            {/* Card 2 - Clarity */}
            <div className="rounded-3xl bg-orange-600 p-8 shadow-sm text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bebas text-2xl">Relentless Progress</h3>
              <p className="mt-3 text-white/80 leading-relaxed">
                Growth isn't linear, but it should be measurable. Our tools provide clear, actionable insights so
                you always know where you stand and what's next.
              </p>
            </div>

            {/* Card 3 - Trust */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bebas text-2xl text-gray-900">Unwavering Trust</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                We vet every professional and verify every product. In an industry full of noise, GymGem is
                incorrectly the signal you can rely on.
              </p>
            </div>

            {/* Card 4 - Wellness */}
            <div className="md:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-bebas text-2xl text-gray-900">Holistic Wellness</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Health happens 24/7, not just in the gym. Our platform integrates nutrition, sleep, and
                mindfulness to support the whole person, not just the athlete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-bebas text-5xl text-white sm:text-6xl lg:text-7xl">
            READY TO ELEVATE YOUR <span className="text-orange-500">JOURNEY?</span>
          </h2>
          <p className="mt-6 text-xl text-gray-400">
            Join thousands of others who have found their rhythm, their coach, and their community on GymGem.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="/trainers" className="inline-flex h-14 items-center justify-center rounded-xl bg-orange-600 px-8 text-base font-bold text-white transition-all hover:bg-orange-500 hover:scale-105 shadow-xl shadow-orange-900/20">
              Find a Trainer
            </a>
            <a href="/signup" className="inline-flex h-14 items-center justify-center rounded-xl bg-white/10 px-8 text-base font-bold text-white transition-all hover:bg-white/20 backdrop-blur-sm">
              Become a Member
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
