import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const FeatureCard = ({ icon, title, description, className = '' }) => {
    const [isNear, setIsNear] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!cardRef.current) return;

            const rect = cardRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            const threshold = 200;

            if (distance < threshold) {
                setIsNear(true);
                const intensity = (threshold - distance) / threshold;
                setPosition({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height,
                });
            } else {
                setIsNear(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <motion.div
            ref={cardRef}
            className={`relative p-8 bg-[#1A1A1A] border border-[#333] overflow-hidden ${className}`}
            whileHover={{
                scale: 1.02,
                borderColor: '#D4AF37',
            }}
            animate={{
                scale: isNear ? 1.01 : 1,
            }}
            transition={{
                duration: 0.3,
                ease: 'easeOut',
            }}
        >
            {/* Cursor tracking light effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-0"
                animate={{
                    opacity: isNear ? 0.1 : 0,
                    background: `radial-gradient(circle 300px at ${position.x * 100}% ${position.y * 100}%, #D4AF37, transparent)`,
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Accent line */}
            <motion.div
                className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* Content */}
            <div className="relative z-10">
                <div className="text-4xl mb-4 text-[#D4AF37]">{icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-[#FAFAFA]">{title}</h3>
                <p className="text-base text-[#999] leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
