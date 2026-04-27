# Gym Membership Management: Product Architecture & UI/UX Brief

**Project Goal:** Transform the existing functional MVP into a high-fidelity, mobile-native experience while preserving all current features and content logic.

---

## 1. Global Design System (Core Tokens)
*   **Typography:** Modern Sans-Serif (Inter/Outfit). Use **Black (900)** weights for headings and **Uppercase Tracking (wider)** for metadata labels.
*   **Color Palette:** 
    *   *Primary:* Action Blue (#2563eb)
    *   *Success:* Emerald (#10b981)
    *   *Alert:* Rose (#f43f5e)
    *   *Warning:* Amber (#f59e0b)
    *   *Surface:* Neutral Grays with subtle glassmorphism (backdrop-blur) for overlays.
*   **Aesthetics:** "Glassmorphism" light mode, rounded corners (2xl/3xl), and soft shadow elevations for depth.

---

## 2. Page-Level Architecture

### Page 1: Login / Authentication
*   **Content:** Simple credentials entry.
*   **Mobile Focus:** Full-screen focused layout, oversized tap targets for inputs, and biometric-ready UI patterns.

### Page 2: Dashboard (Overview)
*   **Content:** High-level summary of gym performance and critical alerts.
*   **Mobile Focus:** Vertical scrolling feed with horizontal "Summary Chips."

### Page 3: Member Directory (List & Filter)
*   **Content:** Searchable database of all members.
*   **Mobile Focus:** "Card-List" pattern instead of tables.

### Page 4: Member Profile (Detailed View)
*   **Content:** Complete 360-degree view of a specific member.
*   **Mobile Focus:** Tab-less "Scrolled Profile" or "Expandable Sections."

### Page 5: Member Forms (Add/Edit)
*   **Content:** Multi-step or long-form data entry.
*   **Mobile Focus:** Multi-step "wizard" or clearly partitioned sections.

### Page 6: Financial History (Payments)
*   **Content:** Log of all revenue transactions.
*   **Mobile Focus:** Transaction-centric feed with date-grouped headers.

### Page 7: Settings & Configuration
*   **Content:** Administrative controls for the system.
*   **Mobile Focus:** "iOS Settings" style list menus.

---

## 3. Global UX Modules
*   **Global Sidebar (Desktop) / Bottom Nav (Mobile):** Primary navigation links.
*   **Top Navbar:** Page title, Notification Bell, and Admin Profile.
*   **Global Toaster:** Success/Error notifications (Sonner style).
*   **Action Sheets:** All "Add" or "Edit" modals should slide up from the bottom on mobile devices.
