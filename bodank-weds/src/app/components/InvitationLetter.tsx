import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router';

interface GuestData {
  code: string;
  name: string;
  category: string;
  message: string;
  plusOne: boolean;
}

interface Props {
  guestData: GuestData;
  onReset: () => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Groomsman': 'text-blue-600',
    'Bridesmaid': 'text-pink-600',
    'Family': 'text-amber-600',
    'Dignitary': 'text-purple-600',
    'Church Member': 'text-green-600',
    'School Mate': 'text-cyan-600',
    'Friend': 'text-rose-600',
  };
  return colors[category] || 'text-primary';
};

export default function InvitationLetter({ guestData, onReset }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto"
    >
      {/* Envelope Opening Animation */}
      <motion.div
        initial={{ rotateX: 0 }}
        animate={{ rotateX: -15 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Letter Card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-12 px-8 text-center border-b border-primary/20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: 'spring' }}
            >
              <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-serif text-5xl md:text-6xl text-primary mb-2"
            >
              You're Invited
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '150px' }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-px bg-primary/30 mx-auto"
            />
          </div>

          {/* Letter Content */}
          <div className="p-8 md:p-12">
            {/* Personalized Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mb-8"
            >
              <p className="text-lg text-muted-foreground mb-2">Dear</p>
              <h2 className="font-serif text-4xl text-primary mb-4">
                {guestData.name}
              </h2>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary ${getCategoryColor(guestData.category)}`}>
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{guestData.category}</span>
              </div>
            </motion.div>

            {/* Invitation Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="space-y-6 mb-8"
            >
              <p className="text-lg leading-relaxed text-foreground/80">
                {guestData.message}
              </p>

              <div className="py-6 my-6 border-y border-border">
                <p className="text-center font-serif text-2xl text-primary mb-6">
                  Join us as we celebrate the union of
                </p>
                <p className="text-center font-serif text-4xl md:text-5xl text-primary mb-2">
                  Richmod Boakye Dankwah
                </p>
                <p className="text-center text-2xl text-muted-foreground mb-2">&</p>
                <p className="text-center font-serif text-4xl md:text-5xl text-primary">
                  Belinda Korkor Nartey
                </p>
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      Saturday, August 15, 2026
                    </p>
                    <p className="text-sm text-muted-foreground">2:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Venue</p>
                    <p className="text-sm text-muted-foreground">
                      Royal Gardens Event Center
                    </p>
                    <p className="text-sm text-muted-foreground">Accra, Ghana</p>
                  </div>
                </div>
              </div>

              {guestData.plusOne && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                  className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <p className="text-center text-sm text-primary">
                    ✨ You're invited to bring a plus one
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/rsvp" className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white tracking-wider"
                >
                  RSVP Now
                </Button>
              </Link>
              <Link to="/details" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white tracking-wider"
                >
                  View Details
                </Button>
              </Link>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-border text-center"
            >
              <p className="text-sm text-muted-foreground mb-4">
                We look forward to celebrating with you!
              </p>
              <button
                onClick={onReset}
                className="text-xs text-muted-foreground hover:text-primary underline"
              >
                Enter a different code
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
