import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client for storage
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket on startup
const bucketName = 'make-9b4f1284-wedding-photos';
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log('Wedding photos bucket created');
    }
  } catch (error) {
    console.log('Bucket initialization error:', error);
  }
})();

// Initialize sample invitation codes
(async () => {
  try {
    const sampleGuests = [
      {
        code: 'RB2026GROOM1',
        name: 'Kwame Mensah',
        category: 'Groomsman',
        message: 'We are honored to have you stand by our side on this special day.',
        plusOne: true
      },
      {
        code: 'RB2026BRIDE1',
        name: 'Ama Asante',
        category: 'Bridesmaid',
        message: 'Your friendship means the world to us. Thank you for being part of our celebration.',
        plusOne: true
      },
      {
        code: 'RB2026FAM1',
        name: 'The Dankwah Family',
        category: 'Family',
        message: 'Family is where life begins and love never ends. We are blessed to have you.',
        plusOne: true
      },
      {
        code: 'RB2026DIG1',
        name: 'Hon. Dr. Stephen Amoah',
        category: 'Dignitary',
        message: 'Your presence would grace our celebration. We look forward to celebrating with you.',
        plusOne: true
      },
      {
        code: 'RB2026CHURCH1',
        name: 'Pastor Emmanuel',
        category: 'Church Member',
        message: 'Thank you for your spiritual guidance. Join us as we begin this blessed journey.',
        plusOne: true
      },
      {
        code: 'RB2026SCHOOL1',
        name: 'Akosua Owusu',
        category: 'School Mate',
        message: 'From classroom memories to lifelong friendships. Celebrate with us!',
        plusOne: false
      },
      {
        code: 'RB2026FRIEND1',
        name: 'Yaw Agyeman',
        category: 'Friend',
        message: 'Friends make the journey sweeter. We can\'t wait to celebrate with you!',
        plusOne: false
      },
    ];

    for (const guest of sampleGuests) {
      const existing = await kv.get(`invite:${guest.code}`);
      if (!existing) {
        await kv.set(`invite:${guest.code}`, JSON.stringify(guest));
      }
    }
    console.log('Sample invitation codes initialized');
  } catch (error) {
    console.log('Sample data initialization error:', error);
  }
})();

// Health check endpoint
app.get("/make-server-9b4f1284/health", (c) => {
  return c.json({ status: "ok" });
});

// Validate invitation code
app.post("/make-server-9b4f1284/validate-invite", async (c) => {
  try {
    const { code } = await c.req.json();
    
    if (!code) {
      return c.json({ error: 'Invitation code is required' }, 400);
    }

    const inviteData = await kv.get(`invite:${code.toUpperCase()}`);
    
    if (!inviteData) {
      return c.json({ error: 'Invalid invitation code' }, 404);
    }

    const guest = JSON.parse(inviteData);
    return c.json({ success: true, guest });
  } catch (error) {
    console.log('Invite validation error:', error);
    return c.json({ error: 'Failed to validate invitation code' }, 500);
  }
});

// Submit RSVP
app.post("/make-server-9b4f1284/submit-rsvp", async (c) => {
  try {
    const { code, attending, guests, mealPreference, message } = await c.req.json();
    
    if (!code) {
      return c.json({ error: 'Invitation code is required' }, 400);
    }

    const inviteData = await kv.get(`invite:${code.toUpperCase()}`);
    if (!inviteData) {
      return c.json({ error: 'Invalid invitation code' }, 404);
    }

    const rsvpData = {
      code: code.toUpperCase(),
      attending,
      guests: guests || 1,
      mealPreference,
      message,
      timestamp: new Date().toISOString()
    };

    await kv.set(`rsvp:${code.toUpperCase()}`, JSON.stringify(rsvpData));
    
    return c.json({ success: true, message: 'RSVP submitted successfully' });
  } catch (error) {
    console.log('RSVP submission error:', error);
    return c.json({ error: 'Failed to submit RSVP' }, 500);
  }
});

// Upload photo
app.post("/make-server-9b4f1284/upload-photo", async (c) => {
  try {
    const { code, imageData, filename } = await c.req.json();
    
    if (!code || !imageData || !filename) {
      return c.json({ error: 'Code, image data, and filename are required' }, 400);
    }

    // Validate invite code
    const inviteData = await kv.get(`invite:${code.toUpperCase()}`);
    if (!inviteData) {
      return c.json({ error: 'Invalid invitation code' }, 404);
    }

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const filepath = `${code.toUpperCase()}/${Date.now()}-${filename}`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filepath, binaryData, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (error) {
      console.log('Storage upload error:', error);
      return c.json({ error: 'Failed to upload photo' }, 500);
    }

    // Store photo metadata in KV
    const photoId = `photo:${Date.now()}`;
    const photoMetadata = {
      id: photoId,
      code: code.toUpperCase(),
      filepath,
      filename,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(photoId, JSON.stringify(photoMetadata));

    return c.json({ 
      success: true, 
      message: 'Photo uploaded successfully',
      photoId 
    });
  } catch (error) {
    console.log('Photo upload error:', error);
    return c.json({ error: 'Failed to upload photo' }, 500);
  }
});

// Get uploaded photos
app.get("/make-server-9b4f1284/photos", async (c) => {
  try {
    const photos = await kv.getByPrefix('photo:');
    
    const photoList = await Promise.all(
      photos.map(async (photoStr) => {
        const photo = JSON.parse(photoStr);
        
        // Generate signed URL
        const { data } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(photo.filepath, 3600); // 1 hour expiry
        
        return {
          id: photo.id,
          url: data?.signedUrl || '',
          filename: photo.filename,
          timestamp: photo.timestamp
        };
      })
    );

    return c.json({ photos: photoList.filter(p => p.url) });
  } catch (error) {
    console.log('Fetch photos error:', error);
    return c.json({ error: 'Failed to fetch photos' }, 500);
  }
});

Deno.serve(app.fetch);