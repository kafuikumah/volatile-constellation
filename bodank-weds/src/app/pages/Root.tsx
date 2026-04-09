import { Outlet, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import LoadingScreen from '../components/LoadingScreen';
import FloatingParticles from '../components/FloatingParticles';
import ScrollToTop from '../components/ScrollToTop';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'motion/react';

export default function Root() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Show loading screen on initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-white relative">
          <FloatingParticles />
          <Navigation />
          <ScrollToTop />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <Outlet />
              <Footer />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );
}