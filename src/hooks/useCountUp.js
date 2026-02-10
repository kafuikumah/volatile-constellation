import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating a number from 0 to targetValue
 * @param {number} targetValue - The final value to count up to
 * @param {number} duration - Animation duration in milliseconds (default: 2000)
 * @returns {number} - The current animated value
 */
export const useCountUp = (targetValue, duration = 2000) => {
    const [currentValue, setCurrentValue] = useState(0);
    const startTimeRef = useRef(null);
    const rafRef = useRef(null);
    const prevTargetRef = useRef(null);

    useEffect(() => {
        // Don't animate if target is 0 or undefined
        if (!targetValue || targetValue === 0) {
            setCurrentValue(0);
            return;
        }

        // Reset and start animation when targetValue changes
        if (prevTargetRef.current !== targetValue) {
            prevTargetRef.current = targetValue;
            startTimeRef.current = null;
            setCurrentValue(0);

            const animate = (timestamp) => {
                if (!startTimeRef.current) {
                    startTimeRef.current = timestamp;
                }

                const elapsed = timestamp - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic for smooth deceleration
                const easeOut = 1 - Math.pow(1 - progress, 3);

                const value = easeOut * targetValue;
                setCurrentValue(value);

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                } else {
                    setCurrentValue(targetValue);
                }
            };

            rafRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [targetValue, duration]);

    return currentValue;
};

export default useCountUp;
