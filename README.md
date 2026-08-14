# EntreVerse 2026

**Flagship Entrepreneurship Festival of E-Cell, IIT Kanpur**  
*August 29–30, 2026 · IIT Kanpur*

---

## 🚀 Tech Stack

- **Unified Framework**: [Next.js](https://nextjs.org/) (App Router, Node.js runtime)
- **Language**: Pure JavaScript / JSX (`ES2022+`)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs`
- **Styling**: Tailwind CSS, CSS Tokens, Motion (`motion/react`), Lucide React
- **Architecture**: Single unified Next.js folder (Frontend UI + Backend `/api` Routes + MongoDB Models)

---

## 📁 Single-Folder Project Structure

```
entreverse_26/
├── app/
│   ├── api/                 # Next.js Node.js Route Handlers (Backend REST API)
│   │   ├── health/          # Health probe
│   │   ├── events/          # Public events API
│   │   ├── competitions/    # Public competitions API
│   │   ├── register/        # Team registration handler
│   │   ├── registrations/   # Registration receipts & team lookups
│   │   └── admin/           # Authenticated admin routes
│   ├── admin/               # Admin Portal UI (Dashboard, Teams, Competitions, Events, Login)
│   ├── register/            # Multi-step team registration wizard
│   ├── layout.jsx           # Root layout & theme configuration
│   ├── page.jsx             # Festival landing page
│   ├── robots.js            # SEO robots configuration
│   └── sitemap.js           # Dynamic sitemap generator
├── components/
│   ├── background/          # Interactive canvas starfield & particle background
│   ├── nav/                 # Responsive glassmorphism navigation
│   ├── register/            # Step wizards, cards, and form controls
│   ├── ui/                  # UI components (Buttons, Dialogs, Cards, Badges, etc.)
│   ├── hero.jsx             # Hero section
│   ├── growth-section.jsx   # Continuum of Innovation stages
│   ├── competitions-section.jsx # Flagship competition cards
│   ├── events-section.jsx   # Speaker talks & workshops
│   └── site-footer.jsx      # IITK map overlay footer & newsletter
├── lib/
│   ├── db.js                # Cached Mongoose connection manager
│   ├── seed.js              # Idempotent database seeder (Events, Competitions, Admins)
│   ├── auth.js              # JWT generation, verification & bcrypt auth
│   ├── api.js               # Client-side public API client
│   ├── admin-api.js         # Client-side admin API client with token storage
│   └── utils.js             # Class merging & utility functions
├── models/                  # Mongoose Data Models
│   ├── Event.js             # Festival events
│   ├── Competition.js       # Competitions with protected registration codes
│   ├── Team.js              # Teams & nested members with compound uniqueness
│   ├── Admin.js             # Admin credentials & hashes
│   └── Counter.js           # Auto-incrementing sequence generator
├── public/                  # Static assets & logos
├── docker-compose.yml       # Docker Compose setup (MongoDB + App)
├── Dockerfile               # Production Next.js container build
├── .env.example             # Environment variable template
├── .env.local               # Local development variables
├── jsconfig.json            # Path alias configuration (`@/*`)
└── package.json             # Root npm package configuration
```

---

## 🛠️ Getting Started

### 1. Configure Environment

The project comes preconfigured with `.env.local`:

```env
# MongoDB Connection URI (MongoDB Atlas Online)
MONGODB_URI=mongodb+srv://mohit862006_db_user:Mohit@cluster0.qq4vzgh.mongodb.net/entreverse?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret
JWT_SECRET=entreverse-2026-super-secret-jwt-key-change-in-production

# Default Root Admin (Auto-seeded)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@IITK2026

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Run the Development Server

From the root directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

To run with Docker Compose (spins up local MongoDB + Next.js App):

```bash
docker compose up --build
```

---

## 🔐 Default Admin Accounts

The database automatically seeds the initial event, competitions, and admin accounts on first startup:

| Username | Default Password | Role |
| :--- | :--- | :--- |
| `admin` | `Admin@IITK2026` | Root Administrator |
| `rajc25@iitk.ac.in` | `Admin@IITK2026` | Festival Admin |
| `anand@ecelliitk.com` | `Admin@IITK2026` | Festival Admin |
| `hirani@ecelliitk.com` | `Admin@IITK2026` | Festival Admin |
| `mohit@ecell.com` | `Admin@IITK2026` | Festival Admin |
| `ecell@iitk.ac.in` | `Admin@IITK2026` | Festival Admin |

---

## 🏆 Flagship Competitions

1. **Flip the Future** (`flip-the-future`)
2. **The Strategy Showdown** (`strategy-showdown`)
3. **Start-up Sprint** (`startup-sprint`)

---

## 📡 API Endpoints

### Public Endpoints
- `GET /api/health` — Service health check
- `GET /api/events` — List all active events
- `GET /api/events/[slug]` — Event details
- `GET /api/events/[slug]/competitions` — Competitions for an event
- `GET /api/competitions` — List all competitions
- `GET /api/competitions/[id]` — Competition by numeric ID
- `GET /api/competitions/slug/[slug]` — Competition by slug
- `POST /api/register` — Register a team
- `GET /api/registrations/[team_id]` — Retrieve registration receipt

### Admin Endpoints (`Authorization: Bearer <token>`)
- `POST /api/admin/login` — Authenticate and receive JWT
- `GET /api/admin/teams` — View all registered teams
- `GET /api/admin/teams/[team_id]` — Detailed team roster and contact information
- `POST /api/admin/competitions` — Create competition
- `PATCH /api/admin/competitions/[id]` — Update competition settings
- `POST /api/admin/events` — Create event
- `PATCH /api/admin/events/[id]` — Update event details
