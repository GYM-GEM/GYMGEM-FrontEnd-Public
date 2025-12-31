import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

const MagneticButton = ({ children, className = '', onClick }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        const maxDistance = 100;

        if (distance < maxDistance) {
            const strength = (maxDistance - distance) / maxDistance;
            setPosition({
                x: distanceX * strength * 0.3,
                y: distanceY * strength * 0.3,
            });
        } else {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={buttonRef}
            className={`relative px-8 py-4 text-lg font-medium tracking-wide transition-all ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            animate={{
                x: position.x,
                y: position.y,
            }}
            whileHover={{
                scale: 1.02,
            }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                mass: 0.1,
            }}
            style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                color: '#000',
                border: 'none',
                cursor: 'pointer',
            }}
        >
            <span className="relative z-10">{children}</span>
            <motion.div
                className="absolute inset-0 rounded-sm opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                    background: 'linear-gradient(135deg, #F4D03F 0%, #D4AF37 100%)',
                }}
            />
        </motion.button>
    );
};

export default MagneticButton;
