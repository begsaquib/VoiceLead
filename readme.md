# VoiceLead: Voice-Based Lead Capture at Trade Shows

## Executive Summary

**VoiceLead** is an AI-powered lead capture platform designed for trade show booths and event environments where rapid, hands-free lead collection is critical. Instead of manually filling out forms or business card scanning, booth staff can have leads introduce themselves naturally via voice recording, and the system automatically extracts contact information, company details, and interest notes—all captured in an editable, searchable database within seconds.

---

## The Problem: Lead Loss at Booths

In high-traffic booth environments:

- **Time pressure**: Staff juggling multiple visitors cannot spend 3–5 minutes per person on forms
- **Information gaps**: Critical details like email, phone, or interest areas are often missed or misheard
- **Manual entry errors**: Handwritten notes or rush data entry create typos and duplicate records
- **Post-event delays**: Lead processing happens days later, missing the engagement window
- **Scale challenges**: A single booth operator cannot simultaneously talk to prospects, take notes, AND maintain data quality

**Result**: Lost revenue, missed follow-ups, and wasted booth presence.

---

## The Solution: VoiceLead's Core Workflow

### 1. Hands-Free Recording

After booth staff deliver their product pitch, they ask the lead to introduce themselves:

**Booth staff says**: *"Great! To keep in touch, could you please introduce yourself and share your contact details?"*

**Lead responds naturally**:
> *"Hi, I'm Saqib Ahmed from WeCommit. My email is saqib@gmail.com and my number is +91 9876543210. I'm really interested in your automation tools for our workflow."*

The app captures audio via the device's microphone—no forms, no interruption to conversation flow. The lead speaks naturally, providing their own information.

### 2. AI-Powered Extraction

The audio is sent to **N8N** (workflow automation), which:

- Converts speech-to-text using Whisper API
- Uses Claude/GPT to extract structured fields: **name, email, company, phone, interest**
- Returns JSON with high confidence extraction

### 3. Editable Lead Card

The extracted data appears immediately as an **interactive card**:

```
┌─────────────────────────────────────────┐
│  Name:     Saqib Ahmed       [editable] │
│  Email:    saqib@gmail.com   [editable] │
│  Company:  WeCommit          [editable] │
│  Phone:    +91 9876543210    [editable] │
│  Interest: Automation Tools  [editable] │
│                                         │
│  [Save]  [Discard]                      │
└─────────────────────────────────────────┘
```

Booth staff can correct errors before saving (e.g., misheard name, unclear company).

### 4. Instant Storage

Once **[Save]** is tapped, the lead is stored in **Directus** (headless CMS) with:

- Timestamp (`date_created`)
- Source (`"voice"`)
- Status (`"new"`)
- Association to the booth (`booth_id`)

### 5. Post-Event Analytics & Follow-up

After the event:

- Staff review all captured leads in a **Dashboard**
- Filter by interest, company, or date
- Export to CRM (Salesforce, HubSpot, etc.)
- Send automated follow-ups via email or LinkedIn

---

## Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vite + React + TypeScript | Fast, responsive booth UI |
| **Backend/CMS** | Directus (Headless CMS) | Lead storage, relation management, API |
| **Workflow** | N8N + OpenAI APIs | Audio → text → extraction pipeline |
| **Deployment** | Vercel (frontend) + Docker (Directus) | Scalable, maintainable infrastructure |

### Data Model

**Two core entities:**

#### Booths

```json
{
  "id": "67bbb618-a6ee-...",
  "name": "Tech Booth A",
  "location": "Hall 3, Stand 42",
  "created_at": "2025-12-01T00:00:00Z"
}
```

**Relationship**: One booth → many leads (one-to-many).

#### Leads

```json
{
  "id": "89e3f41e-cbba-...",
  "booth_id": "67bbb618-a6ee-...",
  "name": "Saqib Ahmed",
  "email": "saqib@gmail.com",
  "company": "WeCommit",
  "phone": "+91 9876543210",
  "interest": "Automation Tools",
  "transcript": "audio transcript if stored",
  "status": "new",
  "source": "voice",
  "date_created": "2025-12-21T15:56:19.183Z"
}
```

---

## Major Features (Current Implementation)

### 1. Voice Recording Interface

**Component**: `LeadForm`

- Tap **Mic** button to start recording
- Records in WebM format (browser MediaRecorder API)
- Visual timer shows recording duration
- Tap **Stop** to finalize

**Code flow**:

```
User taps "Record"
  ↓
startRecording() → navigator.mediaDevices.getUserMedia({audio: true})
  ↓
mediaRecorder.start() + timer
  ↓
Lead speaks and introduces themselves (10–30 seconds)
  ↓
User taps "Stop"
  ↓
mediaRecorder.stop() → audioBlob
  ↓
processAudio(audioBlob) → send to N8N
```

### 2. N8N Workflow Integration

**Webhook endpoint**: `https://flow.wecommit.ai/webhook-test/...`

The N8N workflow:

1. **Receives audio blob** from the frontend
2. **Converts to base64** for processing
3. **Sends to Whisper API** (OpenAI) for transcription
4. **Extracts structured data** using Claude prompt:
   ```
   Extract name, email, company, phone, interest from transcript.
   Return JSON: { name, email, company, phone, interest }
   ```
5. **Returns extracted JSON** to frontend

**Request example**:

```json
{
  "audio": "base64-encoded-webm-data",
  "booth_id": "67bbb618-a6ee-..."
}
```

**Response example**:

```json
{
  "data": {
    "name": "Saqib Ahmed",
    "email": "saqib@gmail.com",
    "company": "WeCommit",
    "phone": "+91 9876543210",
    "interest": "Automation & Workflow Tools"
  }
}
```

### 3. Editable Lead Card

**Component**: `LeadForm` (card section)

After extraction, users see:

- **Editable fields**: name, email, company, phone, interest
- **Read-only fields**: source (`"voice"`), status (`"new"`), timestamp
- **Actions**:
  - **[Save]**: POST to Directus `/items/leads`
  - **[Discard]**: Reject and start new recording

**Validation**:

- Email regex check
- Required fields: name, email, company
- Optional: phone, interest

### 4. Directus Backend

**API endpoints used**:

**Fetch all leads for a booth**:

```
GET /items/leads?filter[booth_id][_eq]={BOOTH_ID}&fields=*,date_created
Headers: Authorization: Bearer {TOKEN}
```

**Create new lead**:

```
POST /items/leads
Headers: 
  Content-Type: application/json
  Authorization: Bearer {TOKEN}
Body: {
  name, email, company, phone, interest,
  booth_id, status, source
}
```

**Query in code**: `use-leads.ts`

```typescript
export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ["directus-leads", BOOTH_ID],
    queryFn: async () => {
      const url = `${DIRECTUS_URL}/items/leads?filter[booth_id][_eq]=${BOOTH_ID}...`;
      const res = await fetch(url, { 
        headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` } 
      });
      return (await res.json()).data;
    },
  });
}
```

### 5. Lead Dashboard (Display)

**Component**: `LeadsList`

- **React Query** automatically fetches and caches leads
- **Real-time sync**: When a new lead is saved, the list refreshes
- **Display**: Cards showing name, company, interest, timestamp
- **Filtering** (future): by interest, date range, company

---

## Deployment & Infrastructure

### Local Development

```bash
# Frontend (Vite)
npm run dev  # runs on http://localhost:5173

# Backend (Docker Compose)
docker compose up -d  # Directus + PostgreSQL + Redis
# Directus admin: http://localhost:8055
```

### Production (Vercel + Docker)

**Frontend**:

- Deployed on **Vercel** (https://voicelead-xxx.vercel.app)
- Environment variables:
  - `VITE_DIRECTUS_URL` → production Directus endpoint
  - `VITE_DIRECTUS_TOKEN` → API token
  - `VITE_BOOTH_ID` → default booth
  - `VITE_N8N_WEBHOOK_URL` → N8N webhook endpoint

**Backend**:

- Directus runs on **Docker** (self-hosted or cloud)
- PostgreSQL for persistent storage
- Redis for caching
- CORS enabled for Vercel origin

**API Integration**:

- N8N webhook processes audio asynchronously
- All communication authenticated via bearer tokens

---

## User Journey at a Trade Show

### Before VoiceLead

```
Visitor approaches booth
  ↓
Staff ask: "Name? Email? Company?"
  ↓
Staff scribble on notepad or try to remember
  ↓
Visitor leaves
  ↓
Staff enters data into spreadsheet (hours later, errors)
  ↓
CRM sync happens next week
  ↓
Lead opportunity window closed
```

### With VoiceLead

```
Visitor approaches booth
  ↓
Staff deliver product pitch
  ↓
Staff say: "Could you introduce yourself and share your contact?"
  ↓
Staff tap "Record"
  ↓
Lead speaks naturally: "I'm Saqib from WeCommit, email is..."
  ↓
Audio captured automatically
  ↓
AI extracts: name, email, company, interest (5 seconds)
  ↓
Editable card appears on screen
  ↓
Staff verify and tap [Save]
  ↓
Lead instantly in Directus dashboard
  ↓
Follow-up email sent that evening
  ↓
Lead warm and engaged the next day
```

---

## Scalability & Future Features

### Current Limitations

- **Single booth default**: Multi-booth support coded but not fully exposed in UI
- **Transcript storage**: Optional; N8N can save full transcript to Directus
- **No CRM sync**: Leads stay in Directus; export to Salesforce/HubSpot done manually
- **No analytics**: Dashboard is list-based; no charts or insights yet
- **No follow-up automation**: Leads marked but no email/SMS follow-up integrated

### Planned Enhancements

1. **Multi-Booth Management**
   - UI to select booth at app load
   - Dashboard showing all booths' leads
   - Per-booth filtering and reporting

2. **CRM Integration**
   - Direct sync with Salesforce, HubSpot
   - Automatic lead assignment to sales reps
   - Two-way sync for status updates

3. **Advanced AI**
   - Intent scoring (hot lead vs. curious browser)
   - Automated follow-up recommendations
   - Multi-language transcription

4. **Analytics Dashboard**
   - Lead volume over time
   - Top interests by day
   - Conversion tracking
   - Revenue attribution

5. **Mobile App**
   - Native iOS/Android for even faster booth flow
   - Offline recording (sync when online)
   - Push notifications for new leads

---

## Development Standards

### Frontend (Vite + React)

- **State management**: React Query (server state), useState (UI state)
- **Environment variables**: Vite's `import.meta.env.VITE_*` pattern
- **Type safety**: Full TypeScript, interface-driven
- **UI components**: Lucide React icons, custom CSS, accessibility-first

### Backend (Directus)

- **Authentication**: Bearer token (static API token for now; rotate in production)
- **CORS**: Whitelist production origin
- **Relationships**: One-to-many (booth → leads)
- **Versioning**: PostgreSQL with date tracking on all records

### Automation (N8N)

- **Webhook trigger**: Receive audio blob
- **Processing**: Whisper (transcription) + Claude (extraction)
- **Error handling**: Retry on API failure, return error to frontend
- **Logging**: N8N built-in logs for debugging

---

## Getting Started (For New Developers)

### Clone & Setup

```bash
git clone https://github.com/wecommit/voicelead.git
cd voicelead/client

npm install
npm run dev

# In another terminal, start Directus + DB
cd .. && docker compose up -d
```

### Key Files

- **`src/hooks/use-leads.ts`** – Directus queries
- **`src/components/LeadForm.tsx`** – Recording + extraction UI
- **`src/components/LeadsList.tsx`** – Display saved leads
- **`.env.example`** – Environment variable template

### Environment Setup

```env
VITE_DIRECTUS_URL=http://localhost:8055
VITE_DIRECTUS_TOKEN=your-api-token
VITE_BOOTH_ID=your-booth-id
VITE_N8N_WEBHOOK_URL=https://flow.wecommit.ai/webhook/...
```

---

## Conclusion

**VoiceLead** transforms booth staffing from a manual, error-prone process into a frictionless, AI-assisted lead capture machine. By letting leads introduce themselves naturally while AI handles data extraction, booth teams can engage more prospects, reduce errors, and follow up faster—turning booth presence into pipeline growth.

The current MVP proves the core concept works. Future versions will scale to multi-booth management, deep CRM integration, and advanced intent scoring—all built on the same solid Directus + N8N + Vite foundation.
