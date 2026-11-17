# Coy SDE Intern Assignment

An implementation of the **Coy SDE Intern Assignment** consisting of:
1. **Part A:** Product Research & Core Feature Proposals for Coy
2. **Part B:** Standalone Mobile-First **"Discover"** Tab with Double-Blind Matching Engine

---

## Part A: Coy Product Suggestions

### App Exploration Summary
Tested Coy at [app.getcoy.com](https://app.getcoy.com) covering:
- Phone OTP login
- Adding secret crushes
- Email verification
- Viral invite links
- Extra slots screen

### Feature 1: Anonymous Campus / Circle Nudge (Viral Onboarding with Zero Privacy Leak)
* **What it is:** When a user adds a crush whose phone number/contact is not yet on Coy, the platform can trigger a privacy-preserving notification (via SMS or WhatsApp):
  > *"Someone from your college/circle added you as a secret crush on Coy! Create an account to see if feelings are mutual."*
* **Why it is required:** 
  - **Overcoming the "Cold Start" Asymmetry:** In double-blind matching, User A receives zero utility if their crush doesn't know Coy exists. 
  - **High Conversion & Retention:** By creating intrigue and curiosity without identifying the sender, it creates a viral network effect in college campuses while staying true to Coy's non-creepy, double-blind privacy ethos.

### Feature 2: Crush Lifecycle Management & "Silent Archive" (Reciprocal Time-Boxing)
* **What it is:** Provide an opt-in validity window (e.g. 90-day validity or "Silent Archive") where users can pause, archive, or refresh their secret crush list.
* **Why it is required:**
  - **Dynamic Real-World Relationships:** Feelings, relationship statuses, and friendships evolve. If a crush joins the platform 12 months after being added, triggering an unintended match could lead to uncomfortable real-world scenarios.
  - **User Autonomy:** Giving users the ability to gracefully deactivate or archive a crush without notifying anyone reinforces trust and aligns with how modern dating dynamics operate.

---

## Part B: Discover Tab & Matching Engine

### Tech Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS (Mobile-first design)
- **Animations & Gestures:** Framer Motion (touch drag gestures, swipe velocity throw, rotation physics)
- **Icons & Effects:** Lucide React, Canvas Confetti
- **Backend APIs:** Next.js Server Route Handlers (`/feed`, `/swipe`, `/matches`, `/reset`)
- **Data Layer:** Persistent JSON File Store (`data/db.json`)

---

### Key Requirements Implemented

1. **Profile Data (32 Seed Profiles):**
   - Seeded with realistic young adults across Indian universities (IIT Roorkee, BITS Pilani, St. Xavier's, SRCC, Ashoka, NID, etc.).
   - Includes portrait photography, age, college/city, bio, and interest tags.
   - 16 profiles are pre-seeded to have already liked the logged-in user, allowing mutual matches during demos.

2. **Coy Double-Blind Privacy Guarantee (Strict Server-Side Isolation):**
   - In `GET /feed`, `hasLikedUser` is **completely stripped** from every profile object before sending it to the client. The frontend has zero way of knowing who liked the user until a mutual like occurs.
   - Matching logic is evaluated strictly server-side in `POST /swipe`.

3. **Swipe Experience:**
   - 3D depth-stacked profile cards.
   - **Mobile Gestures:** Smooth horizontal drag gestures with dynamic tilt and velocity throw.
   - **Desktop Controls:** Dedicated Pass (❌), Like (💖), and Reset (🔄) buttons.
   - Visual stamps: **LIKE** (green) and **NOPE** (red) badges that dynamically fade in as the card is dragged.
   - Once swiped, a profile **never appears again** in the feed.
   - **Empty State:** Clean *"You're All Caught Up"* view when all profiles have been swiped.

4. **Matching & Celebrations:**
   - When a mutual like happens, an interactive **"It's a Match!"** modal triggers immediately with confetti animation and dual avatar visual.
   - Dedicated **"Matches"** tab listing all mutual matches with timestamps, college info, and an interactive chat preview drawer.

5. **Persistence:**
   - All swipes and mutual matches persist across page reloads in `data/db.json`.
   - Includes a quick **Reset Demo** button in the header and empty state for seamless evaluator re-testing.

---

## Backend API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/feed` | Returns profiles the user has not yet swiped on (privacy safe). |
| `POST` | `/swipe` | Accepts `{ profileId, action: "like" \| "pass" }`, returns `{ success, matched, profile? }`. |
| `GET` | `/matches` | Returns all mutual matches for the user. |
| `POST` | `/reset` | Resets swipes and matches for testing. |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated API Verification Suite
```bash
npm run build
node scripts/verify-api.mjs
```
