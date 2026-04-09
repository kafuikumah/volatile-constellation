import { Heart } from 'lucide-react';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="mb-6">
            <Heart className="w-8 h-8 mx-auto text-primary/50 mb-4" />
            <p className="font-serif text-3xl text-primary mb-2">
              Richmod & Belinda
            </p>
            <p className="text-sm text-muted-foreground tracking-wider">
              AUGUST 15, 2026
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/story" className="text-muted-foreground hover:text-primary transition-colors">
              Our Story
            </Link>
            <Link to="/details" className="text-muted-foreground hover:text-primary transition-colors">
              Details
            </Link>
            <Link to="/gallery" className="text-muted-foreground hover:text-primary transition-colors">
              Gallery
            </Link>
            <Link to="/rsvp" className="text-muted-foreground hover:text-primary transition-colors">
              RSVP
            </Link>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Made with <Heart className="inline w-4 h-4 text-primary mx-1" /> for our special day
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2026 Richmod & Belinda. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
