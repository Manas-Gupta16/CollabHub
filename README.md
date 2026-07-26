# CollabHub – Modern Full-Stack Team Collaboration Platform

CollabHub is an enterprise-grade collaboration platform designed for modern software teams to manage tasks, communicate in real time, monitor project activity, and control workspace permissions efficiently.

Built with a focus on scalable backend architecture, Next.js 16 App Router frontend design, clean code practices, real-time WebSockets, and production-level engineering workflows.

---

## Live Production Deployment

- **Web Application**: [https://collabhub-frontend.onrender.com](https://collabhub-frontend.onrender.com)
- **Backend REST API**: [https://collabhub-backend-68xr.onrender.com/api](https://collabhub-backend-68xr.onrender.com/api)
- **Interactive Swagger API Documentation**: [https://collabhub-backend-68xr.onrender.com/api-docs](https://collabhub-backend-68xr.onrender.com/api-docs)

---

## Key Features

### Authentication & Security
- **JWT & Session Authentication**: Secure token-based authentication with request interceptors and Bearer token header handling.
- **Google OAuth 2.0**: Single sign-on integration using Google Auth Library and `@react-oauth/google`.
- **Role-Based Access Control (RBAC)**: Granular permissions for workspace owners, admins, members, and guests.
- **Email Verification & Password Resets**: Nodemailer SMTP integration for email verification and password reset workflows.

### Workspace Management
- **Multi-Tenant Workspaces**: Create, manage, and switch between multiple workspaces.
- **Member Invitations**: Unique invite tokens and email invitation flows.
- **Channel & Project Organization**: Group team activities into dedicated workspace channels.

### Task & Project Management
- **Kanban & List Views**: Task tracking with real-time status transitions (`todo`, `in_progress`, `review`, `completed`).
- **Priorities & Assignees**: Priority levels (`urgent`, `high`, `medium`, `low`), due dates, and member assignments.
- **Task Comments**: Threaded discussions and comment attachments per task.

### Real-Time Communication
- **Socket.IO Integration**: Low-latency instant messaging across workspace channels.
- **Live Notifications**: Real-time push alerts for user mentions, task assignments, and workspace invites.
- **Centralized Inbox**: Notifications inbox with read/unread filtering and single-click state updates.

### Activity & Analytics Audit Trail
- **Workspace Audit Logs**: Immutable activity logging for member actions, task updates, and workspace configuration changes.
- **Interactive Dashboards**: Visual analytics powered by Recharts.

### Billing & Subscription Plans
- **Tiered Pricing**: Free, Pro, and Enterprise subscription tiers with feature quotas.
- **Payment & Checkout Integrations**: Subscription lifecycle management and billing views.

### Global Search & Filtering
- **Unified Search**: Search across tasks, messages, channels, and team members instantly.

---

## Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (React 19, App Router, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion, Base UI, Lucide icons
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/), [TanStack React Query v5](https://tanstack.com/query)
- **Real-Time Client**: Socket.IO Client

### Backend
- **Runtime**: Node.js & Express.js (v5.x, MVC Architecture)
- **Database**: MongoDB with Mongoose ORM
- **WebSockets**: Socket.IO Server
- **Security & Utilities**: Helmet, Express Rate Limit, Express Validator, Bcrypt, JsonWebToken, Nodemailer
- **API Documentation**: Swagger UI (`/api-docs`) powered by `swagger-jsdoc`

---

## Project Structure

```txt
CollabHub/
│
├── backend/
│   ├── src/
│   │   ├── config/         # Database & environment configurations
│   │   ├── controllers/    # Express request handlers
│   │   ├── middleware/     # Authentication, rate limiting, error handling
│   │   ├── models/         # Mongoose database models
│   │   ├── routes/         # REST API routes
│   │   ├── services/       # Core business logic
│   │   ├── utils/          # Helper functions & utilities
│   │   ├── validators/     # Express-validator schemas
│   │   ├── app.js          # Express app configuration & middleware pipeline
│   │   ├── server.js       # HTTP server entry point
│   │   └── socket.js       # Socket.IO event handlers
│   ├── .env
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/        # Authentication pages
│   │   │   ├── (marketing)/   # Public marketing landing page & pricing
│   │   │   └── (dashboard)/   # Core application dashboard & workspace environment
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # API client, Socket handlers, utilities
│   │   └── providers/         # Context & state providers
│   └── package.json
│
├── render.yaml              # Render Blueprint deployment configuration
├── README.md
└── LICENSE
```

---

## Installation & Local Setup

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

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

The API server runs on `http://localhost:5000`. Interactive Swagger API documentation is available at `http://localhost:5000/api-docs`.

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend development server:

```bash
npm run dev
```

The web application runs on `http://localhost:3000`.

---

### 4. Cloud Deployment (Render Blueprint)

CollabHub includes a `render.yaml` Blueprint file for automated deployment on [Render](https://render.com/):

1. Connect your repository in the **Render Dashboard** -> **Blueprints**.
2. Provide required environment variables (`MONGO_URI`, `NEXT_PUBLIC_API_URL`).
3. Render automatically provisions the Next.js Frontend Web Service and Node.js WebSockets Backend Service.

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user and return JWT |
| `POST` | `/api/auth/google` | Authenticate using Google OAuth 2.0 |
| `GET` | `/api/workspaces` | List workspaces for the authenticated user |
| `POST` | `/api/workspaces` | Create a new workspace |
| `GET` | `/api/tasks` | List workspace tasks with filtering |
| `POST` | `/api/tasks` | Create a new task item |
| `GET` | `/api/messages/:workspaceId` | Fetch channel messages |
| `GET` | `/api/notifications` | Fetch user notifications |
| `GET` | `/api/activity/:workspaceId` | Fetch workspace audit logs |
| `GET` | `/api-docs` | Interactive OpenAPI Swagger UI |

---

## Testing

To execute automated backend test suites:

```bash
cd backend
npm test
```

---

## License

Distributed under the MIT License.

---

## Author

**Manas Gupta**  
*Software Engineer*  
GitHub: [@Manas-Gupta16](https://github.com/Manas-Gupta16)
