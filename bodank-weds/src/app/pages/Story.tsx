import { motion } from 'motion/react';
import { Heart, Sparkles, Calendar } from 'lucide-react';

const timeline = [
  {
    year: '2019',
    title: 'How We Met',
    description: 'Our paths crossed at a mutual friend\'s gathering in Accra. What started as a casual conversation over coffee turned into hours of laughter and connection. We both knew something special was beginning.',
    image: 'https://images.unsplash.com/photo-1542338332-76971ae8c292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBmaXJzdCUyMG1lZXRpbmclMjBjb2ZmZWV8ZW58MXx8fHwxNzc1NzEzNDgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Heart,
  },
  {
    year: '2020-2024',
    title: 'The Journey',
    description: 'Through life\'s ups and downs, we grew together. From late-night phone calls to weekend adventures, from supporting each other\'s dreams to building our own traditions. Every moment strengthened our bond and deepened our love.',
    image: 'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHN1bnNldHxlbnwxfHx8fDE3NzU2MTUzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Sparkles,
  },
  {
    year: '2025',
    title: 'The Proposal',
    description: 'On a beautiful evening overlooking the ocean, Richmod asked Belinda the most important question of their lives. Surrounded by candles and under a sky full of stars, she said "Yes!" It was a moment of pure magic and the beginning of forever.',
    image: 'https://images.unsplash.com/photo-1673939608254-4ceb6e440e1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJyaWFnZSUyMHByb3Bvc2FsJTIwcmluZ3xlbnwxfHx8fDE3NzU3MTM0ODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    icon: Calendar,
  },
];

export default function Story() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-secondary/30 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <Heart className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6">
            Our Love Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Every love story is beautiful, but ours is our favorite. Here's how two hearts became one.
          </p>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {timeline.map((chapter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true, margin: '-100px' }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 mb-24 last:mb-0`}
            >
              {/* Image */}
              <div className="flex-1">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={chapter.image}
                      alt={chapter.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
                    viewport={{ once: true }}
                    className="absolute -top-6 -left-6 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-xl"
                  >
                    <chapter.icon className="w-10 h-10 text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                    <span className="text-primary font-medium">{chapter.year}</span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl text-primary mb-6">
                    {chapter.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {chapter.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-b from-secondary/30 to-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <Heart className="w-12 h-12 mx-auto text-primary/30 mb-8" />
          <blockquote className="font-serif text-3xl md:text-4xl text-foreground/90 leading-relaxed mb-8 font-light">
            "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine."
          </blockquote>
          <p className="text-muted-foreground text-lg tracking-wider">
            — Maya Angelou
          </p>
        </motion.div>
      </section>

      {/* Next Chapter */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-12">
            <Calendar className="w-16 h-16 mx-auto text-primary mb-6" />
            <h3 className="font-serif text-4xl text-primary mb-4">
              The Next Chapter
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              And now, we begin the greatest adventure of all—marriage. We can't wait to celebrate this new chapter with you on August 15, 2026.
            </p>
            <div className="inline-block">
              <div className="h-px w-32 bg-primary/30 mx-auto" />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
