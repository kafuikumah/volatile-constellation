import { useState } from 'react';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Heart, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface RSVPFormData {
  inviteCode: string;
  attending: 'yes' | 'no';
  guests: string;
  mealPreference: string;
  message: string;
}

export default function RSVP() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RSVPFormData>({
    defaultValues: {
      attending: 'yes',
      guests: '1',
      mealPreference: 'chicken',
    }
  });

  const attending = watch('attending');

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4f1284/submit-rsvp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            code: data.inviteCode.toUpperCase(),
            attending: data.attending === 'yes',
            guests: parseInt(data.guests),
            mealPreference: data.mealPreference,
            message: data.message,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success('RSVP submitted successfully!');
        setIsSubmitted(true);
      } else {
        toast.error(result.error || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Failed to submit RSVP');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-secondary/30 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-24 h-24 mx-auto text-primary mb-6" />
          </motion.div>
          <h1 className="font-serif text-5xl md:text-6xl text-primary mb-6">
            Thank You!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {attending === 'yes' 
              ? "We're so excited to celebrate with you on our special day!"
              : "We'll miss you on our special day, but we appreciate you letting us know."}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-secondary/30 to-white">
      <div className="max-w-3xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Heart className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="font-serif text-6xl md:text-7xl text-primary mb-6">
            RSVP
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Please let us know if you'll be joining us for our celebration
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 md:p-12 shadow-2xl border-primary/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Invitation Code */}
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Invitation Code *</Label>
                <Input
                  id="inviteCode"
                  {...register('inviteCode', { required: 'Invitation code is required' })}
                  placeholder="Enter your invitation code"
                  className={`h-12 ${errors.inviteCode ? 'border-destructive' : ''}`}
                />
                {errors.inviteCode && (
                  <p className="text-sm text-destructive">{errors.inviteCode.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Find this code on your invitation
                </p>
              </div>

              {/* Attending */}
              <div className="space-y-3">
                <Label>Will you be attending? *</Label>
                <RadioGroup
                  defaultValue="yes"
                  onValueChange={(value) => setValue('attending', value as 'yes' | 'no')}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="cursor-pointer flex-1">
                      Joyfully accepts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="cursor-pointer flex-1">
                      Regretfully declines
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {attending === 'yes' && (
                <>
                  {/* Number of Guests */}
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests *</Label>
                    <Select
                      defaultValue="1"
                      onValueChange={(value) => setValue('guests', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Meal Preference */}
                  <div className="space-y-2">
                    <Label htmlFor="mealPreference">Meal Preference</Label>
                    <Select
                      defaultValue="chicken"
                      onValueChange={(value) => setValue('mealPreference', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chicken">Chicken</SelectItem>
                        <SelectItem value="fish">Fish</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="Share your wishes or any special requests..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg tracking-wider"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit RSVP
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Please respond by <span className="font-medium text-primary">July 15, 2026</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
