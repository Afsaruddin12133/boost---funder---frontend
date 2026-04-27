## 🎯 Goal

Design a modern, premium-grade **multi-platform SaaS UI (Web + Mobile responsive)** for a private startup deal discovery platform called **BoostFundr**, where founders showcase startups and investors discover, unlock, and request access to deals.

The design must feel:

* Ultra modern fintech + startup SaaS
* High trust, premium, and minimal
* Dark-mode first
* Highly structured and dashboard-driven
* Similar quality level as Stripe, AngelList, Product Hunt (premium version)

---

# 🎨 DESIGN SYSTEM (STRICT)

## 🟢 Primary Brand Colors

* Primary Accent: `#01F27B`
* Hover/Glow: `rgba(1, 242, 123, 0.9)`
* Soft Background: `rgba(1, 242, 123, 0.1)`

## ⚫ Background System

* App Background: `#000000`
* Surface Cards: `#0c0c0c`
* Input Surface: `rgba(0,0,0,0.4)` / `rgba(255,255,255,0.05)`
* Deep Brand Tint: `#06120b`

## ⚪ Typography

* Primary Text: `#ffffff`
* Secondary Text: `rgba(255,255,255,0.7)`
* Muted Text: `rgba(255,255,255,0.4)`
* Borders: `rgba(255,255,255,0.1)`
* Active Border: `rgba(1,242,123,0.3)`

## 🟡 Status Colors

* Warning: `#f59e0b`
* Success: `#10b981` (or brand green)
* Error: `#f43f5e`

---

# 🧩 GLOBAL UI STYLE RULES

* Dark mode only
* Glassmorphism + soft glow accents
* Smooth hover animations (scale 1.02, glow border)
* Rounded corners (12px–20px)
* Card-based layout
* Minimal but dense information structure
* Use subtle gradients with green accent only
* Strong hierarchy typography
* Use iconography for navigation clarity
* Micro-interactions for buttons, cards, and tags
* Sticky sidebars in dashboards

---

# 🧭 PLATFORM STRUCTURE

The system has 4 roles:

1. Investor
2. Founder
3. Admin
4. Guest (limited view)

Each role has separate dashboard UI and navigation.

---

# 📱 PAGES TO DESIGN (FULL SYSTEM)

---

# 1️⃣ AUTH SYSTEM (LOGIN / REGISTER)

## Design Requirements:

* Minimal dark centered card UI
* Split layout (left: branding, right: form)
* Animated brand glow background
* Social login buttons optional

### Fields:

* Email
* Password
* Role selection (Investor / Founder)
* Sign up / Login toggle

### UI Behavior:

* Smooth validation states
* Green glow on active input
* Error in red soft alert box

---

# 2️⃣ LANDING PAGE (PUBLIC)

## Structure:

### Hero Section

* Headline:
  “Discover private startup deals. Connect directly with founders.”
* CTA buttons:

  * Get Started
  * Explore Deals

### Sections:

* Featured Deals carousel
* Trending Startups grid
* How it works (Investor / Founder split)
* Subscription plans preview
* Verified founders section
* Testimonials
* Final CTA

### UI Style:

* Large typography
* Floating cards
* Subtle animated gradient background
* Green accent highlights on hover

---

# 3️⃣ DEAL FEED (MAIN PLATFORM)

## Layout:

* Left sidebar navigation
* Center feed (scrollable cards)
* Right panel (filters / recommendations)

## Deal Card Includes:

* Startup name
* Pitch (short)
* Category badge
* Stage (seed/series A etc.)
* Founder name + verification badge
* Traction highlights
* Save button
* Request Access button

## Interaction:

* Hover expands card slightly
* Save icon animates
* Request Access triggers modal

---

# 4️⃣ DEAL DETAIL PAGE (MOST IMPORTANT)

## Layout:

* Hero section (startup branding)
* Tab system:

  * Overview
  * Traction
  * Team
  * Media
  * Documents (locked/unlocked)

## Sections:

### Public Info:

* Startup description
* Problem / Solution
* Market
* Business model
* Stage
* Geography

### Locked Section (Premium):

* Founder contact
* Pitch deck download
* Financials
* Data room

### CTA Panel (sticky right):

* View Deal
* Request Access
* Unlock Full Access
* Save Deal

## UI Style:

* Premium SaaS layout
* Lock overlay with blur effect
* Green highlight for unlock CTA

---

# 5️⃣ INVESTOR DASHBOARD

## Layout:

* Sidebar navigation
* Main analytics panel

## Sections:

### Dashboard Cards:

* Saved deals
* Unlocked deals
* Requests sent
* Engagement score

### Recommended Deals:

* AI-based suggestion grid

### Filters:

* Sector
* Stage
* Geography

---

# 6️⃣ FOUNDER DASHBOARD

## Layout:

* Sidebar navigation (more tools heavy)

## Sections:

### Startup Profile Builder:

* Edit startup info
* Upload pitch deck
* Upload media

### Analytics:

* Views
* Requests
* Conversion rate

### Request Management:

* Accept / Reject requests
* View investor profiles

---

# 7️⃣ REQUEST ACCESS SYSTEM (CORE FLOW)

## UI:

* Modal popup system

## Flow:

1. Click Request Access
2. If free → show paywall
3. If subscribed → confirm request
4. Founder receives request
5. Approval system UI

## Status:

* Pending
* Approved
* Rejected

---

# 8️⃣ SUBSCRIPTION PAGE

## Layout:

* Pricing cards (3 columns)

### Investor Plans:

* Free
* Pro
* Elite

### Founder Plans:

* Free
* Boost
* Scale
* Raise Pro

## UI Style:

* Highlight Pro plan in green glow
* Animated hover comparison
* Feature checklist with icons

---

# 9️⃣ ADMIN PANEL (POWERFUL DASHBOARD)

## Layout:

* Sidebar + analytics grid

## Sections:

* Users management
* Startup approvals
* Verification system
* Subscription tracking
* Featured deals control
* Revenue analytics

## UI Style:

* Dense data tables
* Filterable grids
* Status badges (green/yellow/red)
* Modal-based editing

---

# 🔟 NOTIFICATIONS SYSTEM

## UI:

* Slide-in panel

## Types:

* Request received
* Approval updates
* Subscription alerts
* Deal updates

## Style:

* Toast + panel hybrid
* Green for success
* Amber for warning

---

# 🧠 DESIGN INTELLIGENCE RULES

* Always prioritize clarity over decoration
* Keep investor experience frictionless
* Founder UI should feel powerful but simple
* Admin UI should feel data-heavy but clean
* Every action must have clear feedback
* Use consistent green branding only for success & primary CTAs

---

# 🚀 FINAL OUTPUT EXPECTATION FROM SIGMA AI

Generate a **fully structured UI system** including:

* Web responsive design
* Component system
* All pages listed above
* Consistent design language
* Modern SaaS UI quality (Stripe-level polish)
* Dark mode premium fintech aesthetic
* Fully aligned with BoostFundr business logic