# Master Prompt — Build a Complete EdTech Assessment Platform From Scratch

Paste this entire prompt into your AI coding tool (Claude Code, Cursor, v0, Bolt, Windsurf) as the project brief. It is self-contained — the tool should be able to scaffold the full product from this alone, asking clarifying questions only where marked.

---

## ROLE & GOAL

You are building **a production-ready, dual-sided SaaS platform for K-12 assessments** in India (CBSE/ICSE/State Boards). Three actors: **Schools/Teachers**, **Parents**, **Students** (link-only, no account). The bar is: this should look and feel like it was built by a top-tier product team (Linear/Vercel/Stripe/Notion level of visual and interaction polish) — not a generic admin-template SaaS.

Build it in phases, and after each phase, show me a working, demoable slice before moving to the next.

---

## 1. TECH STACK (use exactly this unless you have a strong reason to deviate — explain if so)

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, React Server Components + Server Actions |
| Language | TypeScript, strict mode, no `any` |
| Styling | Tailwind CSS v4 + CSS variables for design tokens |
| Components | shadcn/ui (Radix primitives), customized — not default theme |
| Animation | Framer Motion |
| Forms/validation | react-hook-form + zod |
| Charts | Tremor or Recharts |
| Database | PostgreSQL (Neon or Supabase) |
| ORM | Drizzle (preferred for type-safety + performance) or Prisma |
| Auth | Auth.js or Clerk — email/OTP (schools), WhatsApp OTP (parents), signed JWT single-use links (students) |
| Realtime | Supabase Realtime or Pusher (live proctoring, live grading queue) |
| Cache/queues | Redis (Upstash) — rate limiting, link expiry, background jobs |
| AI | Anthropic Claude API — question generation, subjective grading, tutoring, at-risk detection |
| Payments | Razorpay (India-first), webhook-verified subscription billing |
| Email | Resend + React Email templates |
| Messaging | WhatsApp Business Cloud API |
| File/media | Cloudflare R2 or S3-compatible storage for question images/attachments |
| Hosting | Vercel (India/Mumbai edge region) |
| CDN/Security | Cloudflare (WAF, DDoS) |
| Monitoring | Sentry (errors), PostHog (product analytics), Vercel Analytics (web vitals) |
| Background jobs | Inngest or Vercel Cron |
| i18n | next-intl — English, Hindi, + scaffold for 8 more regional languages |
| Testing | Vitest (unit), Playwright (e2e), Storybook (component docs) |
| CI/CD | GitHub Actions, preview deploys per PR, staging + production environments |

---

## 2. DESIGN & UX PRINCIPLES (non-negotiable)

- **Own a visual identity.** Pick a real primary color (not default indigo/blue) — commit to it in a token file. Full neutral gray scale + semantic success/warning/danger colors. Ship light **and** dark mode from day one, properly tested for contrast.
- **Typography with intent.** A distinctive display/heading font + a highly legible body font. Full Devanagari + regional script support for non-English UI, not just the tutor chat.
- **Motion with restraint.** Scroll-triggered fade/slide entrances, staggered list reveals, animated counters, smooth state transitions on tabs/accordions/modals. No motion that delays the user from acting.
- **Real product visuals over stock imagery.** Dashboard mockups should be built as actual working UI, screenshotted or embedded live — never generic illustrations of "students at laptops."
- **Progressive disclosure.** Test-builder, grading queue, and analytics are information-dense — use expandable sections, tabs, and command-palette (⌘K) style navigation rather than cramming everything on one screen.
- **Accessibility is a first-class requirement**, not a pass at the end: WCAG 2.1 AA, full keyboard navigation (test-taking flow must be keyboard-operable), screen-reader-tested ARIA labeling, visible focus states.
- **Performance budget**: LCP < 2s, CLS < 0.1, TTI < 3s on 4G. Use RSC streaming, image optimization, and route-level code splitting to hit this.
- **Empty states, loading states, and error states are designed, not default.** Every list/table/dashboard needs a deliberate empty and error state, not a blank screen or raw error text.

---

## 3. FULL FEATURE LIST

### A. Marketing & Growth
- Home, About, Pricing, Security/Trust, Blog (MDX), Contact, Careers (optional)
- Dual-audience hero with a lightweight "which are you?" decision aid
- Real testimonials/case-study structure (placeholder-marked until real data supplied)
- SEO: per-page metadata, OpenGraph, JSON-LD, sitemap, robots.txt
- Referral program scaffolding (parent-refers-parent, school-refers-school)

### B. Auth & Identity
- School/teacher: email + OTP, invite-based team onboarding, role assignment (admin/teacher)
- Parent: WhatsApp OTP login, multi-child + multi-school linking
- Student: no account — signed, single-use, time-bound test links; capture name + roll number only
- **Global Student ID (GSID)**: portable identity model that persists across schools/years — design the schema so a student's history follows them

### C. Test Creation (AI-assisted)
- Step flow: Board → Class → Subject → Chapters → difficulty mix → question types
- AI drafts MCQ / short-answer / long-answer / image-based questions with marking scheme + answer key, streamed in as they generate
- Manual edit/regenerate-per-question, question bank save/reuse
- Paper blueprint templates (weightage by chapter/difficulty per board guidelines)
- Multi-language question generation

### D. Secure Test Delivery
- One-time signed links, shareable via WhatsApp/email, auto-expiring after the test window
- Fullscreen enforcement, tab-switch detection, copy-paste blocking, randomized question/option order per student
- Low-bandwidth-friendly delivery (critical for rural India — test as offline-tolerant as possible, queue submissions if connection drops)

### E. Live Proctoring
- Real-time dashboard: in-progress/flagged/submitted status per student
- Flag types: tab-switch, fullscreen-exit, excessive idle time, paste-attempt
- Teacher can message/warn a student mid-test

### F. Grading
- Instant auto-score for objective questions
- Claude-powered rubric-based scoring for subjective answers, with confidence score
- Teacher review queue for low-confidence AI grades, with one-click override
- Grade change audit log

### G. Analytics & Insight
- Teacher: chapter/topic mastery heatmap, class trend over time, per-student drill-down
- Admin: cross-class/cross-school comparison, teacher activity, engagement metrics
- Parent: child's mark history, attendance trend, subject-wise strength/weakness
- At-risk detection: flag students on declining trend or low mastery before exams, notify teacher + parent

### H. AI Tutor (Parent/Student-facing, Pro tier)
- Chat scoped to the student's actual mistake history (RAG over their wrong answers, not generic Q&A)
- Multilingual (12 languages), explains with worked examples
- Usage caps enforced per plan tier

### I. Notifications
- WhatsApp + email: new result published, attendance change, at-risk alert, subscription events
- In-app notification center for teachers/admins

### J. Billing
- Razorpay subscriptions, annual + (if applicable) monthly plans
- GST-inclusive pricing display with tax breakdown in a tooltip, not inline
- Plan upgrade/downgrade with proration, invoice history, dunning emails on failed payment
- Institutional/bulk pricing tier for schools (separate from parent Free/Pro)

### K. Admin/Institution Console
- Multi-school management, bulk teacher/student roster import (CSV), org-wide analytics and billing

### L. Platform/Compliance
- India DPDP Act–aware data handling: consent capture for parents, data minimization for student records, data export/delete on request
- Role-based access control across all five actor types
- Full audit logging for grade changes, data access, admin actions

---

## 4. DATA MODEL (starting point — expand as needed)

Core entities: `Organization (School)`, `User (role: admin|teacher|parent)`, `Student (GSID)`, `ParentStudentLink`, `Class`, `Subject`, `Chapter`, `Test`, `Question`, `TestAttempt`, `Answer`, `Grade`, `ProctorEvent`, `Subscription`, `Invoice`, `Notification`, `AuditLog`.

Design the schema so:
- A `Student` (GSID) can belong to multiple `Organization`s over time (school transfers).
- `TestAttempt` is immutable once submitted; `Grade` is a separate versioned record for auditability.
- `ProctorEvent` is an append-only log keyed to `TestAttempt`.

---

## 5. BUILD PHASES (demo after each)

1. **Foundation** — repo scaffold, design tokens, component library (Storybook), auth skeleton, database schema + migrations.
2. **Marketing site** — fully polished home/pricing/security/blog pages, real copy, SEO.
3. **Teacher core loop** — test builder (AI generation) → secure link → student takes test → auto-grading → results dashboard. This is the product's spine; get it fully working end-to-end before anything else.
4. **Live proctoring + subjective grading queue.**
5. **Parent portal** — WhatsApp login, dashboard, notifications, billing.
6. **AI tutor.**
7. **Admin/institution console + bulk import.**
8. **Compliance, audit logs, accessibility pass, performance pass.**
9. **CI/CD, monitoring, staging → production launch checklist.**

---

## 6. WHAT TO ASK ME BEFORE STARTING

Only pause for clarification on:
- Preferred hosting/db provider if you have constraints beyond what's listed above
- Whether Razorpay vs. Stripe (India entity vs. international)
- Real brand color/logo assets, or should the AI propose an original palette
- Any existing content (real testimonials, school logos, curriculum data) vs. placeholders

Do not pause for anything else — make a sensible, stated assumption and proceed.
