Pages & Screens — detailed specification (page-by-page)

For each page: purpose, top UI elements, required fields, interactions, edge cases / validation, and sample copy.

1) Landing / Home

Purpose: Explain app, CTA to report an issue or sign in; show public transparency highlights.

Top UI elements

Hero with tagline: “Report problems. Track progress. Make your city better.”

Quick CTA buttons: “Report an issue” (opens report flow), “Track my complaint”

Public highlights widget: total complaints, resolved today, % resolved last month

Map preview with recent resolved issues markers (clickable)

Interactions

CTA to signup/login for full features; allow anonymous quick report (limited features) — see Auth rules below.

Footer: About, FAQ, Privacy Policy, Contact.

Edge cases

If Google Maps fails to load, show fallback address text input.

2) Signup / Login (Auth)

Purpose: Secure user identity + role (citizen / admin).

Fields

Signup: name, email, phone (optional), password, confirm password, accept terms.

Login: email + password, “Forgot password” link.

Social sign-in: Google OAuth optional.

Interactions

Email verification flow on signup.

Password strength indicator.

Role assignment: default citizen; admin accounts created separately.

Edge cases

Rate limit signups per IP, handle duplicate email gracefully.

3) Report Issue (Single-page wizard)

Purpose: Primary flow for citizens to file complaints with photo & location.

Top UI elements

Category dropdown (pothole, garbage, streetlight, water leak, sanitation, other)

Photo upload (drag & drop + camera on mobile), multiple photos allowed (max 5)

Location picker:

Use Google Maps API to detect current location (prompt browser geolocation)

Search/address bar with autocomplete (Google Places)

Pin on map to adjust exact location

Reverse geocode suggested address shown beneath

Short title (required)

Detailed description (required, 20–2000 chars)

Severity selector (Low / Medium / High)

Optional: Attach video, additional comments, preferred contact method (email/phone)

Submit button (disabled until required fields + at least one photo or location present)

UX behavior

Show upload progress; compress images client-side to reasonable size.

On submit: create complaint and show confirmation with Complaint ID and estimated tracking link.

Allow anonymous submission: require email or phone only to receive updates (optional).

Validation

Ensure location exists (lat/lng). If user declines geolocation, force address input.

Validate file types (jpeg/png/webp), size limit 5MB each.

Success screen

Show complaint ID, status = Pending, timeline placeholder, link to “Track my complaints”.

4) My Complaints (Citizen Dashboard)

Purpose: List user’s complaints, status, and quick actions.

Top UI elements

Filter: All / Pending / In Progress / Resolved; sort by date or severity

List or card view with thumbnail, title, short address, status badge, last updated timestamp

Search by complaint ID

Each item: “View details”, “Share”, “Edit” (only while status = Pending), “Withdraw” (optional)

Pagination or infinite scroll

Complaint detail modal/page (See next section)

Edge cases

If user is anonymous (no account), provide a “Track with Complaint ID + email/phone” page.

5) Complaint Detail Page

Purpose: Show full information, timeline, comments, and resolution evidence.

Top UI elements

Big image carousel (photos)

Status badge + progress bar (Pending → In Progress → Resolved)

Map location pin

Fields: ID, category, severity, submitted at, submitted by (if public), description

Timeline: Created → Assigned → In Progress updates → Resolved with timestamps and who updated

Comments section: citizens & admins can comment; comments are moderated

Admin attachments for resolution evidence (e.g., “fixed” photos)

“Report inaccurate/duplicate” button

CTA: subscribe to notifications for this complaint

Interactions

Users can add public comments; admins can reply privately or publicly

When status changes, send email/push to subscribers

Edge cases

If complaint is resolved, show “resolved by” + resolution photos & final notes.

6) Public Dashboard & Map (Transparency)

Purpose: Public-facing searchable map & list of resolved issues to show transparency.

Top UI elements

Full-screen interactive map with colored markers by status (or different icons)

Filter controls: category, date range, status, neighborhood/ward

List view of recent resolved issues with “view detail” links

Aggregate stats: total complaints, % resolved, avg time to resolution (7-day/30-day)

Embedded charts (bar by category, pie by status)

Privacy

Do not show personal contact details publicly—only anonymized or “Submitted by resident”.

7) Admin / Authority Dashboard

Purpose: Manage complaints, assign work, update status, view analytics.

Top UI elements

Overview KPIs: total pending, in progress, resolved today, avg resolution time

Complaint inbox (table): Complaint ID, thumbnail, category, severity, address, submitted at, status, assigned to, actions

Filters: status, ward, category, date range, assigned technician

Search by ID or address

Bulk actions: assign, set status, export CSV

Complaint detail (admin view)

All citizen info (contact) + attachments + comments

Buttons: Assign to team/technician (dropdown), Change status, Add internal note, Upload resolution photos

SLA warnings: highlight complaints older than X hours

Audit log (who changed what, when)

User management

Manage staff accounts (add/remove), assign roles & permissions

Integrations

Link to field technician mobile app (via API) for assignment & proof-of-work.

8) Notifications Settings (User & Admin)

Purpose: Choose notification channels for updates.

Options

Email on status updates (Immediate / Daily digest)

Web push (allow browser push)

SMS (optional, via Twilio)

In-app notifications bell

Behavior

When status changes, send notification with Complaint ID, new status, short message, and link.

For admins: notifications for new complaints in assigned ward.

9) Chatbot Widget (Bonus)

Purpose: Allow quick natural-language status checks and guided reporting.

UI

Floating chat bubble that opens a modal

Quick buttons: “Report an issue”, “Track my complaint”, “How to use”, “Contact support”

Functionality

Rule-based flows:

If user asks “What’s the status of my complaint #ABC123?” → ask for complaint ID + verify email or phone, then return status + last update + link to complaint.

If user asks “How do I report a pothole?” → present step-by-step guide + CTA to “Start report”

Optionally connect to an LLM for free-text Q&A (limit to summary info — never reveal PII)

Log chatbot interactions for analytics

Security

For status queries, require verification (email OTP or phone code) before showing private details.

10) Settings / Profile

Purpose: Update profile, notification preferences, saved addresses.

Fields

Name, email, phone, saved home/work address (for quick reporting), change password

11) FAQ / About / Contact / Legal

Purpose: Info pages with guidance on how complaints are handled, SLA expectations, privacy policy.