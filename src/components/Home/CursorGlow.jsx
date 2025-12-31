import { motion } from 'framer-motion';
import { useCursorPosition } from '../../hooks/useCursorPosition';

const CursorGlow = () => {
    const { cursorPos } = useCursorPosition();

    return (
        <motion.div
            className="fixed pointer-events-none z-50 mix-blend-screen"
            style={{
                left: cursorPos.x,
                top: cursorPos.y,
                width: '600px',
                height: '600px',
                marginLeft: '-300px',
                marginTop: '-300px',
            }}
            animate={{
                x: 0,
                y: 0,
            }}
            transition={{
                type: 'spring',
                damping: 30,
                stiffness: 200,
                mass: 0.5,
            }}
        >
            <div
                className="w-full h-full rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                }}
            />
        </motion.div>
    );
};

export default CursorGlow;
