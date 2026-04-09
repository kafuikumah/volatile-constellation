import { useState } from 'react';
import { motion } from 'motion/react';
import { ImageIcon, X } from 'lucide-react';
import Masonry from 'react-responsive-masonry';
import { Dialog, DialogContent } from '../components/ui/dialog';

const galleryImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1684253866485-b26f847ff97e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Couple' },
  { id: 2, url: 'https://images.unsplash.com/photo-1655682604826-7530b331b3e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Ceremony' },
  { id: 3, url: 'https://images.unsplash.com/photo-1752857015560-d5c05b3f7ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Details' },
  { id: 4, url: 'https://images.unsplash.com/photo-1664312696723-173130983e27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Details' },
  { id: 5, url: 'https://images.unsplash.com/photo-1767986012154-db9a321c8832?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Reception' },
  { id: 6, url: 'https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Couple' },
  { id: 7, url: 'https://images.unsplash.com/photo-1732721674983-7a621db80dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Details' },
  { id: 8, url: 'https://images.unsplash.com/photo-1640794334523-b299f14d28db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Reception' },
  { id: 9, url: 'https://images.unsplash.com/photo-1767986012547-3fc29b18339f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Reception' },
  { id: 10, url: 'https://images.unsplash.com/photo-1765615197726-6d2a157620fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Couple' },
];

const categories = ['All', 'Couple', 'Ceremony', 'Reception', 'Details'];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

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
          <ImageIcon className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Captured moments from our pre-wedding celebrations
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-secondary text-foreground/70 hover:bg-secondary/70'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <Masonry columnsCount={3} gutter="1rem">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={`Gallery ${image.id}`}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="text-white text-center"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm tracking-wider uppercase">{image.category}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl p-0 bg-transparent border-none">
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-primary transition-colors z-50"
                aria-label="Close"
              >
                <X className="w-8 h-8" />
              </button>
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImage.url}
                alt={`Gallery ${selectedImage.id}`}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
