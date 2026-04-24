# Bidyut Nai (বিদ্যুৎ নাই) - Crowdsourced Load-shedding Tracker

A Next.js 16 (App Router) based full-stack web application designed for Bangladeshi users to track, report, and verify power outages (load-shedding) in real-time. The application is built with an extreme focus on UX, accessibility, and zero-login friction.

## 🚀 Key Features

### 1. Zero-Login Identity (Device Fingerprinting)
- Automatically generates a unique UUID stored in `localStorage` upon the first visit.
- Users can submit reports, vote on verifications, and chat without the hassle of creating an account.

### 2. Real-Time Interactive Map (Leaflet.js)
- Uses `react-leaflet` with the CartoDB Dark Matter tile layer for an elegant, premium dark theme.
- Automatically asks for the user’s location with the browser's Geolocation API upon initialization.
- Plots "Power ON" (Green dots) and "Power OFF" (Red dots) statuses directly on the interactive map with glowing effects.
- Displays the user's current geo-location with a pinging marker.

### 3. Location-First Outage Reporting
- Built to enforce high accuracy: A user cannot randomly drop pins anywhere on the map. The map automatically captures their physical location to lock the report coordinates.
- Reverse Geocoding via **Nominatim API** to automatically fetch the area/street name.
- Outage photo proofs (up to **5MB limit**) uploaded securely via the **ImgBB API**.
- Built-in Custom Notification Toasts (Green for success, Red for errors) mapped perfectly to logic.
- Displays correct local time inside forms seamlessly.

### 4. Community Verification System
- Reports appear in the unified "লাইভ রিপোর্টস" (Live Reports) sidebar.
- Users can confidently give 'Thumbs Up' (True) or 'Thumbs Down' (False) to reports submitted by others in their area.
- High positive score securely triggers a **Verified Badge** (Shield icon).
- High negative score obscures the troll/fake report using CSS blur effects.

### 5. Live Public Chat
- Floating Chat widget lets users intelligently discuss the live grid situation over a synchronized channel.
- Uses **Pusher** for real-time WebSocket communication (along with HTTP polling fallback).
- Maintains a specific `bidyut_user_name` locally.

### 6. 100% Bengali Localization & Strict BST Timezone
- The entire frontend is carefully customized for local usage. All dynamic labels, notifications, and components operate strictly in the Bengali Language.
- Native use of **Hind Siliguri** (Google Font) optimized globally.
- Implemented `Intl.DateTimeFormat` explicitly restricting absolute rendering to **Bangladesh Standard Time (BST: Asia/Dhaka)**, successfully bypassing traditional browser/system clock errors.

---

## 💻 Tech Stack
- **Frontend Framework:** Next.js 16 (App Router), React 18/19 
- **Styling:** Tailwind CSS v4 (Strict Premium Dark Theme, Glassmorphism, Micro-animations)
- **Map Library:** Leaflet, React-Leaflet
- **Database:** MongoDB (using Mongoose ODMs)
- **Real-time Engine:** Pusher Channels
- **Cloud Storage:** ImgBB API (Image Hosting integration)
- **Typography:** `next/font/google` (Hind Siliguri)

---

## 🛠 Project Structure Highlights

- **`/app/page.js`**: The central component handling the split-view architecture (Map + Sidebar).
- **`/app/api/reports/route.js`**: Primary POST handler for outage schemas and polling GET requests.
- **`/components/MapComponent.js`**: Dynamic React-Leaflet injection (SSR Disabled) securely fetching `Asia/Dhaka` locale arrays.
- **`/components/ReportModal.js`**: The multi-faceted data collection mechanism covering `ImgBB`, `Nominatim Reverse Geocoding`, and exact UTC-to-BST offset translations.
- **`/components/ReportSidebar.js`**: Iterative feed utilizing community voting arrays. Includes custom utility formatters for absolute localized timezone display.
- **`/components/Header.js`**: Top-layer statistical analysis banner displaying overall counts in BD translations.

---

## 🎨 UI/UX Specifications

- **Theme Color Palette:** Deep dark void background `#0a0a0a`.
- **Glassmorphism Panels:** `#1a1a1a` combined with translucent borders and intense glowing shadows.
- **Primary Accents:** Gold/Yellow (`#c09a59`, `#fbbf24`) applied strictly for call-to-action interactions.
- **Status Indicators:** Emerald Green (`#22c55e`) for clear 'Power ON' states and Danger Red (`#ef4444`) for critical 'Power OFF' emergencies. 
- **Design Philosophy:** Minimalistic, zero noise, high contrast, exclusively mobile-responsive interface. 

---

## ⚙️ Getting Started (Local Development)

1. Clone the repository
2. Install external modules:
   ```bash
   npm install
   ```
3. Set your Environment Variables (`.env`)
   ```env
   # Setup your respective keys:
   MONGODB_URI=
   PUSHER_APP_ID=
   NEXT_PUBLIC_PUSHER_KEY=
   PUSHER_SECRET=
   NEXT_PUBLIC_PUSHER_CLUSTER=
   ```
   *(Note: The ImgBB API key is hardcoded directly inside `ReportModal.js` for simplistic image uploading.)*
4. Run the local Next.js server:
   ```bash
   npm run dev
   ```
5. Navigate to `http://localhost:3000`
