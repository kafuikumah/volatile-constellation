import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      size: 4 + Math.random() * 8,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bottom-0 opacity-10"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 0.3, 0.3, 0],
            x: [0, Math.sin(particle.id) * 100],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-primary"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
