import { useState, useEffect } from 'react';

export const useCursorPosition = () => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [normalizedPos, setNormalizedPos] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        let animationFrameId;
        let lastX = 0;
        let lastY = 0;

        const updateCursor = (e) => {
            lastX = e.clientX;
            lastY = e.clientY;

            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(() => {
                    setCursorPos({ x: lastX, y: lastY });
                    setNormalizedPos({
                        x: lastX / window.innerWidth,
                        y: lastY / window.innerHeight,
                    });
                    animationFrameId = null;
                });
            }
        };

        window.addEventListener('mousemove', updateCursor, { passive: true });

        return () => {
            window.removeEventListener('mousemove', updateCursor);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    return { cursorPos, normalizedPos };
};
