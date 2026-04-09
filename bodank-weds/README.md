# Richmod & Belinda's Wedding Website 💚

A luxury, minimal, and highly animated wedding website built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Personalized Invitations**: Unique invitation codes with dynamic personalized messages
- **Interactive RSVP System**: Guests can RSVP with meal preferences and guest count
- **Photo Upload**: Guests can upload wedding photos after entering their invitation code
- **Animated Gallery**: Beautiful masonry layout with lightbox viewing
- **Wedding Details**: Comprehensive event information with interactive map
- **Bridal Party**: Showcase of groomsmen and bridesmaids
- **Guest Experience**: Travel info and hotel recommendations
- **Elegant Animations**: Smooth page transitions and micro-interactions throughout

## 🎨 Design

- **Theme**: Emerald Green (#046307) with minimal luxury aesthetic
- **Typography**: Cormorant Garamond (serif) + Inter (sans-serif)
- **Style**: Ultra-classy editorial design inspired by high-end fashion websites
- **Animations**: Motion/Framer Motion for smooth, premium interactions

## 🔑 Sample Invitation Codes

Try these codes on the **Invitation** page:

| Code | Guest Name | Category | Plus One |
|------|------------|----------|----------|
| `RB2026GROOM1` | Kwame Mensah | Groomsman | ✓ |
| `RB2026BRIDE1` | Ama Asante | Bridesmaid | ✓ |
| `RB2026FAM1` | The Dankwah Family | Family | ✓ |
| `RB2026DIG1` | Hon. Dr. Stephen Amoah | Dignitary | ✓ |
| `RB2026CHURCH1` | Pastor Emmanuel | Church Member | ✓ |
| `RB2026SCHOOL1` | Akosua Owusu | School Mate | ✗ |
| `RB2026FRIEND1` | Yaw Agyeman | Friend | ✗ |

## 📱 Pages

1. **Home** - Hero section with countdown, gallery preview, and quick links
2. **Our Story** - Animated timeline of the couple's relationship
3. **Wedding Details** - Date, venue, schedule, dress code, and map
4. **Bridal Party** - Groomsmen and bridesmaids with photos and bios
5. **Gallery** - Pre-wedding photos in masonry layout with category filters
6. **RSVP** - Form to confirm attendance with meal preferences
7. **Guest Experience** - Travel info, hotels, and things to do in Accra
8. **Invitation** - Enter code to view personalized invitation letter

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: React Router v7 (Data mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **UI Components**: Radix UI
- **Forms**: React Hook Form
- **Backend**: Supabase (Edge Functions + Storage)
- **Image Gallery**: React Responsive Masonry

## 🚀 Features in Detail

### Invitation System
Each guest receives a unique code that unlocks a personalized invitation with:
- Guest's name and category
- Personalized message based on their relationship
- Wedding details and RSVP link
- Plus-one information if applicable

### Photo Upload System
- Guests must enter valid invitation code to upload photos
- Drag-and-drop interface with progress indicator
- Photos stored in Supabase Storage
- Real-time gallery updates
- Photos appear on homepage for all guests to see

### RSVP System
- Validates invitation code
- Collects attendance confirmation
- Guest count selection
- Meal preference options
- Optional message/special requests
- Beautiful success animation

## 🎯 Design Philosophy

**Quiet Luxury + Modern Romance + Premium Animation**

The website embodies:
- Generous whitespace and balanced layouts
- High-contrast serif typography for elegance
- Smooth scroll-based animations
- Micro-interactions on hover
- Editorial-style photography
- Minimal but impactful color use

## 📝 Notes

- All invitation codes are stored in Supabase KV store
- Photo uploads are validated against invitation codes
- The website is fully responsive (mobile-first design)
- Animations are optimized for performance
- Emerald green (#046307) is used throughout as the primary accent color

---

**Made with 💚 for Richmod & Belinda**
