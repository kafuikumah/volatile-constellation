import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface UploadedPhoto {
  id: string;
  url: string;
  filename: string;
  timestamp: string;
}

export default function PhotoUploadSection() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
    // Refresh photos every 30 seconds
    const interval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4f1284/photos`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    const inviteCode = sessionStorage.getItem('inviteCode');
    
    if (!inviteCode) {
      toast.error('Please enter your invitation code first');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const imageData = reader.result as string;
        
        setUploadProgress(50);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-9b4f1284/upload-photo`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              code: inviteCode,
              imageData,
              filename: file.name,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUploadProgress(100);
          toast.success('Photo uploaded successfully!');
          setTimeout(() => {
            fetchPhotos();
            setUploadProgress(0);
          }, 1000);
        } else {
          toast.error(data.error || 'Failed to upload photo');
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read file');
      };
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-5xl md:text-6xl text-primary mb-4">
            Share Your Memories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload your favorite wedding photos to share with Richmod & Belinda
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary hover:bg-secondary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Upload className="w-16 h-16 text-primary" />
                  </motion.div>
                </div>
                <p className="text-lg font-medium text-foreground">Uploading...</p>
                <div className="max-w-xs mx-auto bg-secondary rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 mx-auto text-primary" />
                <div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    {dragActive ? 'Drop your photo here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select Photo
                </Button>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            💡 Tip: Enter your invitation code first to upload photos
          </p>
        </motion.div>

        {/* Uploaded Photos Grid */}
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-3xl text-center text-primary mb-8">
              Guest Photos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-square rounded-lg overflow-hidden shadow-lg"
                  >
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
