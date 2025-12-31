import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursorGlow from '../components/Home/CursorGlow';
import MagneticButton from '../components/Home/MagneticButton';
import ParallaxSection from '../components/Home/ParallaxSection';
import FeatureCard from '../components/Home/FeatureCard';
import { useCursorPosition } from '../hooks/useCursorPosition';
import Footer from '../components/Footer';

function Home() {
  const navigate = useNavigate();
  const { normalizedPos } = useCursorPosition();
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Background gradient that follows cursor
  const bgGradient = `radial-gradient(circle at ${normalizedPos.x * 100}% ${normalizedPos.y * 100}%, 
    rgba(212, 175, 55, 0.05) 0%, 
    rgba(26, 26, 26, 1) 50%)`;

  // Scroll progress indicator
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="relative bg-black text-[#FAFAFA] overflow-hidden">
      {/* Cursor Glow - Desktop Only */}
      {!isMobile && <CursorGlow />}

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Minimal Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold tracking-tight"
            whileHover={{ color: '#D4AF37' }}
            transition={{ duration: 0.3 }}
          >
            GYMGEM
          </motion.div>
          <motion.button
            onClick={() => navigate('/login')}
            className="text-sm tracking-widest text-[#999] hover:text-[#D4AF37] transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            SIGN IN
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center px-8"
        style={{
          background: isMobile ? '#000' : bgGradient,
        }}
      >
        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-[0.9] tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #FAFAFA 0%, #999 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Elevate Your
              <br />
              <span className="text-[#D4AF37]">Fitness Journey</span>
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-[#999] max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            A premium platform connecting you with elite trainers,
            personalized nutrition, and cutting-edge AI technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton onClick={() => navigate('/signup')}>
              Start Your Transformation
            </MagneticButton>
            <motion.button
              onClick={() => navigate('/browse')}
              className="px-8 py-4 text-lg font-medium tracking-wide border border-[#333] hover:border-[#D4AF37] transition-all"
              whileHover={{ scale: 1.02, borderColor: '#D4AF37' }}
            >
              Explore Trainers
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-[#333] rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <ParallaxSection className="py-32 px-8" speed={0.3}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
              Crafted for Excellence
            </h2>
            <div className="w-20 h-0.5 bg-[#D4AF37] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="💎"
              title="Premium Trainers"
              description="Connect with certified elite trainers who specialize in personalized fitness programs tailored to your unique goals."
            />
            <FeatureCard
              icon="🎯"
              title="Smart Scheduling"
              description="Effortlessly book sessions with our intelligent calendar system that adapts to your busy lifestyle."
            />
            <FeatureCard
              icon="🤖"
              title="AI Coach"
              description="Leverage cutting-edge AI technology for real-time form correction, workout suggestions, and progress tracking."
            />
            <FeatureCard
              icon="🥗"
              title="Nutrition Plans"
              description="Access personalized meal plans and nutrition guidance designed to complement your training regimen."
            />
            <FeatureCard
              icon="📊"
              title="Progress Analytics"
              description="Track your journey with detailed analytics and insights that highlight your achievements and areas for growth."
            />
            <FeatureCard
              icon="💬"
              title="Direct Messaging"
              description="Stay connected with your trainer through seamless in-app messaging and video consultations."
            />
          </div>
        </div>
      </ParallaxSection>

      {/* Value Proposition 1 */}
      <ParallaxSection className="py-32 px-8 bg-[#0A0A0A]" speed={0.4}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
                Train with
                <br />
                <span className="text-[#D4AF37]">Purpose & Precision</span>
              </h3>
              <p className="text-lg text-[#999] leading-relaxed mb-6">
                Every session is designed with intention. Our platform uses GEM coins,
                a streamlined payment system that makes booking seamless and transparent.
              </p>
              <p className="text-lg text-[#999] leading-relaxed">
                No hidden fees. No complicated contracts. Just pure focus on your transformation.
              </p>
            </motion.div>
            <motion.div
              className="relative h-80 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-[#333] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ borderColor: '#D4AF37' }}
            >
              <div className="text-8xl opacity-20">💎</div>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Value Proposition 2 */}
      <ParallaxSection className="py-32 px-8" speed={0.5}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              className="relative h-80 bg-gradient-to-br from-[#1A1A1A] to-black border border-[#333] flex items-center justify-center order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              whileHover={{ borderColor: '#D4AF37' }}
            >
              <div className="text-8xl opacity-20">🎯</div>
            </motion.div>
            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
                Technology Meets
                <br />
                <span className="text-[#D4AF37]">Human Expertise</span>
              </h3>
              <p className="text-lg text-[#999] leading-relaxed mb-6">
                Our AI trainer doesn't replace your coach—it enhances the experience.
                Get real-time feedback, form analysis, and personalized recommendations.
              </p>
              <p className="text-lg text-[#999] leading-relaxed">
                The perfect fusion of artificial intelligence and human connection.
              </p>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Final CTA Section */}
      <ParallaxSection className="py-40 px-8" speed={0.2}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Begin?
          </motion.h2>
          <motion.p
            className="text-xl text-[#999] mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands who have transformed their lives with GYMGEM.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <MagneticButton onClick={() => navigate('/signup')}>
              Create Your Account
            </MagneticButton>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
