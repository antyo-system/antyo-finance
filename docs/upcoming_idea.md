# Upcoming Ideas & Features

This document is the central repository for all future ideas, brainstorms, and postponed features for Antyo Finance.
**RULE:** Always append new ideas here. Never create a separate file.

---

## Backlog (Unscheduled Ideas)

### Smart Receipt Scanner
- **Concept:** Use the device camera to scan paper receipts and automatically extract transaction data (amount, date, merchant).
- **Complexity:** High (requires OCR integration, possibly Google ML Kit or Tesseract).
- **Phase:** Post-MVP (Phase 3+).
- **Identity Filter Score:** 7/10 — Reduces friction in tracking, but doesn't directly help the user "see who they are becoming."

### Bill Reminder Notifications
- **Concept:** Set reminders for upcoming bills (rent, utilities, subscriptions) with local push notifications.
- **Trigger:** 1-3 days before the bill due date.
- **Action:** Tap notification → opens transaction entry pre-filled with bill details.
- **Phase:** Phase 2.
- **Identity Filter Score:** 6/10 — Utility feature, prevents late fees but is more operational than identity-driven.

### Spending Challenges (Gamification)
- **Concept:** Monthly community challenges like "No Eat Out November" or "Save 30% Challenge" with leaderboards.
- **Viral Potential:** High — shareable progress cards.
- **Phase:** Phase 4 (requires backend).
- **Identity Filter Score:** 9/10 — Directly helps users align spending with identity goals.

### Smart Budget Suggestions
- **Concept:** Based on 3+ months of spending data, the app suggests budget allocations per category using historical averages.
- **Phase:** Phase 3 (Pro feature).
- **Identity Filter Score:** 8/10 — Helps users make better identity-aligned financial decisions.

### Net Worth Tracker
- **Concept:** Track assets (savings, investments) vs liabilities (debts, loans) to show overall financial trajectory.
- **Phase:** Phase 2-3.
- **Identity Filter Score:** 9/10 — Powerful "who you are becoming" metric over time.

### Subscription Tracker
- **Concept:** Dedicated view listing all recurring subscriptions with total monthly cost, cancellation reminders, and "worth it?" prompts.
- **Phase:** Phase 2.
- **Identity Filter Score:** 8/10 — Forces users to confront whether each subscription aligns with their identity.

### Family/Couple Shared Budget
- **Concept:** Invite a partner to share budget categories. Both can add transactions, and the budget reflects combined spending.
- **Phase:** Phase 4 (requires backend + auth).
- **Identity Filter Score:** 7/10 — Important for household financial identity, but complex.

### Wishlist with "Wait 48 Hours" Rule
- **Concept:** Instead of impulse buying, add items to a wishlist with a mandatory 48-hour cooling period. After 48h, the app asks "Do you still want this?"
- **Phase:** Phase 2.
- **Identity Filter Score:** 10/10 — Directly intervenes in impulsive financial decisions and builds conscious spending habits.

### Antyo Mobile Power Features (Evaluated v0.4.0)

#### 1. Financial Discipline Score (0-100%) & Identity Pulse
- **Concept:** Calculate a single dynamic score based on Budget Adherence + Savings Rate + Transaction Logging Consistency (matching Antyo Focus style).
- **Identity Score:** 98/100 — Direct identity feedback loop ("Who you are becoming financially").
- **Phase:** Recommended Next Step.

#### 2. Quick-Add Smart Presets & Frequent Expense Chips
- **Concept:** 1-Tap quick-add chips inside the transaction entry sheet (e.g. `☕ Coffee Rp 25k`, `🍱 Lunch Rp 50k`, `🚖 Transport Rp 30k`).
- **Identity Score:** 95/100 — Reduces transaction logging time to 2 seconds on mobile.
- **Phase:** Recommended Next Step.

#### 3. Proactive Monthly Savings Projection
- **Concept:** Smart pulse banner on Dashboard predicting end-of-month savings based on daily spending velocity.
- **Identity Score:** 92/100 — Enables proactive financial decisions before budget is exceeded.
- **Phase:** Recommended Next Step.
