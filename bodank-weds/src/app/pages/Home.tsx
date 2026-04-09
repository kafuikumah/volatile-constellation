import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import PhotoUploadSection from '../components/PhotoUploadSection';

const weddingDate = new Date('2026-08-15T14:00:00');

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = weddingDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1684253866485-b26f847ff97e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYWZyaWNhbiUyMGNvdXBsZSUyMHdlZGRpbmd8ZW58MXx8fHwxNzc1NzEzMzY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Wedding couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center text-white px-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6"
          >
            <Heart className="w-12 h-12 mx-auto mb-6 text-white/90" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-wider mb-6"
          >
            Richmod & Belinda
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '200px' }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-white/50 mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl tracking-[0.3em] uppercase font-light mb-8"
          >
            A Celebration of Love
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex items-center justify-center gap-6 text-sm md:text-base mb-12"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>August 15, 2026</span>
            </div>
            <div className="w-px h-4 bg-white/50" />
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Accra, Ghana</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Link to="/invitation">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base tracking-wider"
              >
                View Your Invitation
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.button>
      </section>

      {/* Countdown Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-primary mb-4">
              Save the Date
            </h2>
            <p className="text-muted-foreground text-lg">
              We're counting down the days until we say "I do"
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="font-serif text-6xl md:text-7xl text-primary font-light mb-2">
                  {value}
                </div>
                <div className="text-sm tracking-wider uppercase text-muted-foreground">
                  {unit}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Love Quote Section */}
      <section className="py-24 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="mb-8">
            <Heart className="w-12 h-12 mx-auto text-primary/30" />
          </div>
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground/90 leading-relaxed mb-8 font-light">
            "Love is not just looking at each other, it's looking in the same direction."
          </blockquote>
          <p className="text-muted-foreground text-lg tracking-wider">
            — Antoine de Saint-Exupéry
          </p>
        </motion.div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              A glimpse into our love story
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              'https://images.unsplash.com/photo-1767986012154-db9a321c8832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzc1NzEzMzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
              'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMG91dGRvb3J8ZW58MXx8fHwxNzc1NzEzMzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
              'https://images.unsplash.com/photo-1732721674983-7a621db80dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBnb2xkfGVufDF8fHx8MTc3NTY4Mjc4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
            ].map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={img}
                  alt={`Gallery preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link to="/gallery">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 tracking-wider"
              >
                View Full Gallery
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Our Story',
                description: 'Discover how our love story began',
                link: '/story',
                icon: Heart,
              },
              {
                title: 'Wedding Details',
                description: 'All the information you need for our big day',
                link: '/details',
                icon: Calendar,
              },
              {
                title: 'RSVP',
                description: 'Let us know if you can join us',
                link: '/rsvp',
                icon: MapPin,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={item.link}
                  className="block group bg-secondary/50 rounded-lg p-8 hover:bg-secondary transition-colors"
                >
                  <item.icon className="w-10 h-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-serif text-2xl text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Upload Section */}
      <PhotoUploadSection />
    </div>
  );
}
