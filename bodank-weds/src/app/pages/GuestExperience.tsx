import { motion } from 'motion/react';
import { Plane, Hotel, Car, Info, MapPin, Phone } from 'lucide-react';
import { Card } from '../components/ui/card';

const hotels = [
  {
    name: 'Kempinski Hotel Gold Coast City',
    type: 'Luxury',
    distance: '5 min from venue',
    price: 'From $250/night',
    phone: '+233 302 123 456',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  {
    name: 'Labadi Beach Hotel',
    type: 'Beach Resort',
    distance: '15 min from venue',
    price: 'From $180/night',
    phone: '+233 302 222 501',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
  {
    name: 'Movenpick Ambassador Hotel',
    type: 'Business Hotel',
    distance: '10 min from venue',
    price: 'From $200/night',
    phone: '+233 302 761 616',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  },
];

export default function GuestExperience() {
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
          <Plane className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6">
            Guest Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know for your trip to Accra
          </p>
        </motion.div>
      </section>

      {/* Travel Info */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-5xl text-primary mb-4">Travel Information</h2>
            <div className="h-px w-24 bg-primary/30 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 h-full border-primary/20 shadow-lg">
                <Plane className="w-12 h-12 text-primary mb-6" />
                <h3 className="font-serif text-2xl text-primary mb-4">Getting to Accra</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Airport:</span> Kotoka International Airport (ACC)
                  </p>
                  <p>
                    Major airlines serving Accra include British Airways, KLM, Ethiopian Airlines, Delta, and Emirates.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Visa:</span> Most visitors require a visa. Check requirements for your country at the Ghana Immigration Service website.
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
                <Car className="w-12 h-12 text-primary mb-6" />
                <h3 className="font-serif text-2xl text-primary mb-4">Transportation</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Airport Transfer:</span> Taxis and ride-sharing services (Uber, Bolt) are available at the airport.
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Getting Around:</span> We recommend using ride-sharing apps for convenience and safety.
                  </p>
                  <p>
                    Shuttle service will be provided from select hotels to the venue.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accommodations */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Hotel className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-5xl text-primary mb-4">Recommended Hotels</h2>
            <p className="text-muted-foreground text-lg">
              We've secured special rates at these nearby hotels
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {hotels.map((hotel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-serif text-xl text-primary">{hotel.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{hotel.type}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        {hotel.distance}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        {hotel.phone}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-primary font-medium">{hotel.price}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mention "Richmod & Belinda Wedding" for special rates
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Things to Do */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <MapPin className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-5xl text-primary mb-4">Explore Accra</h2>
            <p className="text-muted-foreground text-lg">
              Make the most of your visit to Ghana's vibrant capital
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Kwame Nkrumah Memorial Park',
                description: 'Visit the final resting place of Ghana\'s first president and explore the museum.',
              },
              {
                title: 'Labadi Beach',
                description: 'Relax on Accra\'s most popular beach with live music and local food.',
              },
              {
                title: 'Makola Market',
                description: 'Experience the bustling heart of Accra and shop for traditional crafts.',
              },
              {
                title: 'Cape Coast Castle',
                description: 'A powerful historical site and UNESCO World Heritage location (2 hours from Accra).',
              },
              {
                title: 'Osu Oxford Street',
                description: 'The trendy district for dining, shopping, and nightlife.',
              },
              {
                title: 'National Museum',
                description: 'Discover Ghana\'s rich history and cultural heritage.',
              },
            ].map((place, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 border-primary/20 hover:shadow-lg transition-shadow">
                  <h3 className="font-medium text-lg text-foreground mb-2">{place.title}</h3>
                  <p className="text-sm text-muted-foreground">{place.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Info className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif text-5xl text-primary mb-4">Good to Know</h2>
          </motion.div>

          <Card className="p-8 border-primary/20 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-lg text-primary mb-4">Weather</h3>
                <p className="text-muted-foreground">
                  August is warm and humid with occasional rain. Pack light, breathable clothing and an umbrella.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg text-primary mb-4">Currency</h3>
                <p className="text-muted-foreground">
                  Ghanaian Cedi (GHS). Credit cards are accepted at major hotels and restaurants.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg text-primary mb-4">Language</h3>
                <p className="text-muted-foreground">
                  English is the official language. Local languages include Twi, Ga, and Ewe.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg text-primary mb-4">Emergency</h3>
                <p className="text-muted-foreground">
                  Police: 191 | Ambulance: 193 | Fire: 192
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h3 className="font-serif text-4xl text-primary mb-4">
            Questions?
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            If you need any assistance planning your trip, please don't hesitate to reach out.
          </p>
          <p className="text-foreground">
            <span className="font-medium">Wedding Coordinator:</span>{' '}
            <a href="mailto:wedding@richmodbelinda.com" className="text-primary hover:underline">
              wedding@richmodbelinda.com
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
}
