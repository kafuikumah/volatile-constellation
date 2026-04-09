import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import InvitationLetter from '../components/InvitationLetter';

interface GuestData {
  code: string;
  name: string;
  category: string;
  message: string;
  plusOne: boolean;
}

export default function Invitation() {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [guestData, setGuestData] = useState<GuestData | null>(null);

  const handleValidateCode = async () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter your invitation code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-9b4f1284/validate-invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ code: inviteCode.toUpperCase() }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setGuestData(data.guest);
        toast.success('Invitation code validated successfully!');
        // Store code in session storage for photo uploads
        sessionStorage.setItem('inviteCode', inviteCode.toUpperCase());
      } else {
        toast.error(data.error || 'Invalid invitation code');
      }
    } catch (error) {
      console.error('Error validating invite code:', error);
      toast.error('Failed to validate invitation code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setGuestData(null);
    setInviteCode('');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-secondary/30 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {!guestData ? (
            <motion.div
              key="code-entry"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-8"
              >
                <Mail className="w-20 h-20 mx-auto text-primary mb-6" />
                <h1 className="font-serif text-5xl md:text-6xl text-primary mb-4">
                  Your Invitation Awaits
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Enter your unique invitation code to view your personalized invitation
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md mx-auto"
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2 text-left">
                    Invitation Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter your code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleValidateCode()}
                      className="pl-11 h-12 text-center tracking-wider uppercase"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleValidateCode}
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white tracking-wider"
                >
                  {isLoading ? 'Validating...' : 'View Invitation'}
                </Button>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
                    Try one of these sample codes:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['RB2026GROOM1', 'RB2026BRIDE1', 'RB2026FAM1'].map((code) => (
                      <button
                        key={code}
                        onClick={() => setInviteCode(code)}
                        className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/70 rounded text-foreground/70 transition-colors"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <InvitationLetter guestData={guestData} onReset={handleReset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
