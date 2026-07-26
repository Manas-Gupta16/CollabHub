# CollabHub – Modern Full-Stack Team Collaboration Platform

CollabHub is a feature-rich, full-stack enterprise-grade collaboration platform designed for modern software teams to manage tasks, communicate in real time, monitor project activity, and control workspace permissions seamlessly.

Built from scratch with a focus on scalable backend architecture, Next.js App Router frontend design, clean code patterns, real-time WebSockets, and production-level engineering workflows.

---

## 🌟 Key Features

### 🔐 Authentication & Security
- **JWT & Session Auth**: Secure token-based auth with request interceptors & Bearer token header handling.
- **Google OAuth 2.0**: Integrated single-sign-on using Google Auth Library and `@react-oauth/google`.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for workspace owners, admins, members, and guests.
- **Email Verification & Password Resets**: Nodemailer SMTP integration for email verification and secure password reset links.

### 🏢 Workspace Management
- **Multi-Tenant Workspaces**: Create, manage, and switch between multiple workspaces.
- **Member Invitations**: Unique invite tokens and email invite flows.
- **Channel & Project Organization**: Group team activities into dedicated workspace channels.

### 📋 Task & Project Management
- **Kanban & List Views**: Task tracking with real-time status transitions (`todo`, `in_progress`, `review`, `completed`).
- **Priorities & Assignees**: Urgent/High/Medium/Low priority tagging, due dates, and task assignments.
- **Task Comments**: Threaded discussions and file/comment support per task.

### 💬 Real-Time Communication
- **Socket.IO Integration**: Low-latency instant messaging across workspace channels.
- **Live Notifications**: Real-time push alerts for user mentions, task assignments, and invite updates.
- **Centralized Inbox**: Notifications tray with read/unread filtering and single-click "mark all as read".

### 📊 Activity & Analytics Audit Trail
- **Workspace Audit Logs**: Track member actions, task status updates, and workspace configuration changes.
- **Interactive Dashboards**: Visual analytics powered by Recharts.

### 💳 Billing & Subscription Plans
- **Tiered Pricing**: Free, Pro, and Enterprise subscription tiers with feature limits.
- **Simulated Checkout Flow**: Subscription lifecycle and billing management views.

### 🔍 Global Search & Filtering
- **Unified Search**: Search across tasks, messages, channels, and team members instantly.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19, App Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion, `@base-ui/react`, Lucide React icons
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/), [TanStack React Query v5](https://tanstack.com/query)
- **Real-Time Client**: Socket.IO Client

### **Backend**
- **Runtime**: Node.js & Express.js (v5.x, MVC Architecture)
- **Database**: MongoDB with Mongoose ORM
- **WebSockets**: Socket.IO Server
- **Security & Utilities**: Helmet, Express Rate Limit, Express Validator, Bcrypt, JsonWebToken, Nodemailer
- **API Specs**: Swagger UI (`/api-docs`) powered by `swagger-jsdoc`

---

## 📁 Project Structure

```txt
CollabHub/
│
├── backend/
│   ├── src/
│   │   ├── config/         # Database & environment configurations
│   │   ├── controllers/    # Express controllers (auth, workspace, task, billing, etc.)
│   │   ├── middleware/     # Auth verification, rate limiting, error handlers
│   │   ├── models/         # Mongoose schemas (User, Workspace, Task, Message, Activity, etc.)
│   │   ├── routes/         # REST API endpoints
│   │   ├── services/       # Core business & background services
│   │   ├── utils/          # Helpers (Nodemailer, tokens, search)
│   │   ├── validators/     # Express-validator schema validation
│   │   ├── app.js          # Express middleware pipeline & routes initialization
│   │   ├── server.js       # HTTP & MongoDB entry point
│   │   └── socket.js       # Socket.IO event handlers
│   ├── .env
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/        # Auth pages (Login, Register, Forgot Password)
│   │   │   ├── (marketing)/   # Public Landing Page & Pricing
│   │   │   └── (dashboard)/   # Main Workspace App (Workspaces, Tasks, Messages, Activity)
│   │   ├── components/        # Reusable UI components & Theme Toggle
│   │   ├── lib/               # Axios API client, Socket instance, Utilities
│   │   └── providers/         # React Query & Theme providers
│   └── package.json
│
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
# Optional: SMTP Configuration for email features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

Start the backend development server:

```bash
npm run dev
```

The backend server runs on `http://localhost:5000`. Swagger API documentation is available at `http://localhost:5000/api-docs`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` directory (optional defaults provided in `lib/api.ts`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend development server:

```bash
npm run dev
```

The frontend client will be accessible at `http://localhost:3000`.

---

## 📡 Key API Endpoint Groups

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT |
| `POST` | `/api/auth/google` | Authenticate with Google OAuth |
| `GET` | `/api/workspaces` | Get workspaces for authenticated user |
| `POST` | `/api/workspaces` | Create new workspace |
| `GET` | `/api/tasks` | Get tasks with status/priority filtering |
| `POST` | `/api/tasks` | Create task item |
| `GET` | `/api/messages/:workspaceId` | Get workspace channel messages |
| `GET` | `/api/notifications` | Fetch unread user notifications |
| `GET` | `/api/activity/:workspaceId` | Fetch workspace audit trail logs |
| `GET` | `/api-docs` | Interactive OpenAPI Swagger UI |

---

## 🧪 Testing

To run backend test suites:

```bash
cd backend
npm test
```

---

## 📄 License

Distributed under the MIT License.

---

## 👤 Author

**Manas Gupta**  
*Full-Stack Engineer & Scalable Systems Enthusiast*  
GitHub: [@Manas-Gupta16](https://github.com/Manas-Gupta16)
