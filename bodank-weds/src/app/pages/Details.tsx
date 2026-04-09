import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Shirt, Music, Utensils, Camera, Church } from 'lucide-react';
import { Card } from '../components/ui/card';

const schedule = [
  { time: '12:30 PM', event: 'Guest Arrival & Registration', icon: Clock },
  { time: '1:30 PM', event: 'Pre-Ceremony Music', icon: Music },
  { time: '2:00 PM', event: 'Ceremony Begins', icon: Church },
  { time: '3:30 PM', event: 'Cocktail Hour', icon: Utensils },
  { time: '5:00 PM', event: 'Reception & Dinner', icon: Utensils },
  { time: '7:00 PM', event: 'First Dance', icon: Music },
  { time: '8:00 PM', event: 'Dancing & Celebration', icon: Music },
];

const dressCode = [
  { title: 'Men', description: 'Dark suits or traditional attire', icon: Shirt },
  { title: 'Women', description: 'Formal dresses or elegant traditional wear', icon: Shirt },
];

export default function Details() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-secondary/30 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <Calendar className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6">
            Wedding Details
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our special day
          </p>
        </motion.div>
      </section>

      {/* Date & Venue */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-primary/20 shadow-lg">
                <Calendar className="w-12 h-12 text-primary mb-6" />
                <h2 className="font-serif text-3xl text-primary mb-4">Date & Time</h2>
                <div className="space-y-3 text-lg">
                  <p className="flex items-center gap-3">
                    <span className="font-medium">Date:</span>
                    <span className="text-muted-foreground">Saturday, August 15, 2026</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="font-medium">Time:</span>
                    <span className="text-muted-foreground">2:00 PM</span>
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-primary/20 shadow-lg">
                <MapPin className="w-12 h-12 text-primary mb-6" />
                <h2 className="font-serif text-3xl text-primary mb-4">Venue</h2>
                <div className="space-y-3 text-lg">
                  <p className="font-medium">Royal Gardens Event Center</p>
                  <p className="text-muted-foreground">
                    123 Independence Avenue<br />
                    East Legon, Accra<br />
                    Ghana
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
                  >
                    <MapPin className="w-4 h-4" />
                    View on Google Maps
                  </a>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8326489241787!2d-0.1534!3d5.6496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzgnNTguNiJOIDDCsDA5JzEyLjIiVw!5e0!3m2!1sen!2sgh!4v1234567890"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Clock className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-5xl text-primary mb-4">Order of Events</h2>
            <p className="text-muted-foreground text-lg">
              A timeline of our special day
            </p>
          </motion.div>

          <div className="space-y-4">
            {schedule.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border-primary/20 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-xl font-medium text-foreground">{item.event}</span>
                      <span className="text-lg text-primary font-medium">{item.time}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Shirt className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-5xl text-primary mb-4">Dress Code</h2>
            <p className="text-muted-foreground text-lg">
              Formal attire requested
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {dressCode.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 text-center border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                  <item.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <h3 className="font-serif text-2xl text-primary mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-lg">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center"
          >
            <p className="text-foreground">
              <span className="font-medium">Color Theme:</span> Emerald Green & Gold accents
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please avoid wearing white or ivory
            </p>
          </motion.div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Camera className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-5xl text-primary mb-4">Important Notes</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Photography', text: 'An unplugged ceremony is requested. Please enjoy the moment!' },
              { title: 'Parking', text: 'Ample parking available at the venue' },
              { title: 'Gifts', text: 'Your presence is the greatest gift. If you wish, monetary gifts are appreciated.' },
              { title: 'Children', text: 'Adult-only celebration (18+)' },
            ].map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border-primary/20">
                  <h3 className="font-medium text-lg text-foreground mb-2">{note.title}</h3>
                  <p className="text-muted-foreground">{note.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
