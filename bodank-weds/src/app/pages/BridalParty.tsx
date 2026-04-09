import { motion } from 'motion/react';
import { Users, Heart } from 'lucide-react';

const groomsmen = [
  { name: 'Kwame Mensah', role: 'Best Man', image: 'https://images.unsplash.com/photo-1664645573936-d734d2cbb21b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'Richmod\'s childhood friend and business partner' },
  { name: 'Kofi Asante', role: 'Groomsman', image: 'https://images.unsplash.com/photo-1664645573936-d734d2cbb21b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'College roommate and confidant' },
  { name: 'Yaw Agyeman', role: 'Groomsman', image: 'https://images.unsplash.com/photo-1664645573936-d734d2cbb21b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'Brother and lifelong supporter' },
  { name: 'Samuel Osei', role: 'Groomsman', image: 'https://images.unsplash.com/photo-1664645573936-d734d2cbb21b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'Mentor and trusted advisor' },
];

const bridesmaids = [
  { name: 'Ama Asante', role: 'Maid of Honor', image: 'https://images.unsplash.com/photo-1654470705270-4e32463edc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'Belinda\'s best friend since high school' },
  { name: 'Akosua Owusu', role: 'Bridesmaid', image: 'https://images.unsplash.com/photo-1654470705270-4e32463edc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'Sister and forever cheerleader' },
  { name: 'Efua Mensah', role: 'Bridesmaid', image: 'https://images.unsplash.com/photo-1654470705270-4e32463edc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'University friend and travel companion' },
  { name: 'Abena Boateng', role: 'Bridesmaid', image: 'https://images.unsplash.com/photo-1654470705270-4e32463edc24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', bio: 'Cousin and fashion consultant' },
];

export default function BridalParty() {
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
          <Users className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6">
            Our Bridal Party
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the amazing people standing by our side on our special day
          </p>
        </motion.div>
      </section>

      {/* Groomsmen */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-5xl text-primary mb-4">Groomsmen</h2>
            <div className="h-px w-24 bg-primary/30 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {groomsmen.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-2xl text-primary mb-1">{person.name}</h3>
                  <p className="text-sm text-primary/70 font-medium mb-2">{person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4"
          >
            <div className="h-px flex-1 bg-border" />
            <Heart className="w-8 h-8 text-primary/50" />
            <div className="h-px flex-1 bg-border" />
          </motion.div>
        </div>
      </section>

      {/* Bridesmaids */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-5xl text-primary mb-4">Bridesmaids</h2>
            <div className="h-px w-24 bg-primary/30 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bridesmaids.map((person, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="text-center">
                  <h3 className="font-serif text-2xl text-primary mb-1">{person.name}</h3>
                  <p className="text-sm text-primary/70 font-medium mb-2">{person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <Heart className="w-12 h-12 mx-auto text-primary/30 mb-6" />
          <h3 className="font-serif text-4xl text-primary mb-4">
            With Gratitude
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We are blessed to have these incredible individuals by our side. Thank you for your love, support, and friendship as we embark on this new chapter together.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
