# Connect Dashboard UI to Backend API

Currently, the Dashboard and Messages UI use hardcoded arrays for Workspaces, Channels, Online Teams, and Workspace Details. This plan outlines how we will connect the frontend to the backend to fetch this real data and fix the navigation bug.

## Open Questions

> [!IMPORTANT]
> **Channel Schema:** The backend currently does not have a "Channel" schema. Should I add an array of `channels` directly to the `Workspace` model (easiest/cleanest for this scope) or create an entirely separate `Channel` model with its own database collection?
> 
> **Mock vs Real Users for "Online Team":** "Online Team" is shown in the right sidebar. Should I pull the actual `members` of the workspace from the database and mark them online randomly/mocked for now (since we don't have presence via websockets fully built yet)?

## Proposed Changes

### Backend (Node.js/Express)

#### [MODIFY] `backend/src/models/Workspace.js`
- Expand the `workspaceSchema` to store all the details needed by the UI:
  - `channels`: Array of objects `{ name: String, isPrivate: Boolean }`
  - `pinnedLinks`: Array of strings (URLs)
  - `keyDeadlines`: Array of objects `{ title: String, date: Date }`
  - `teamGoals`: Array of objects `{ title: String, isCompleted: Boolean }`

#### [MODIFY] `backend/src/controllers/workspaceController.js`
- Ensure `getWorkspaceById` and `getMyWorkspaces` accurately populate these new fields.
- Update `createWorkspace` to insert a default "# general" channel if none provided.

### Frontend (Next.js/React)

#### [MODIFY] `src/app/(dashboard)/layout.tsx`
- **Navigation Fix:** Change the CollabHub logo `href="/"` to `href="/dashboard"` to prevent taking logged-in users back to the landing page.
- **Data Fetching:** Integrate `@tanstack/react-query` (with `axios`) to fetch `workspaces` from `/api/workspaces`.
- Replace hardcoded `workspaces` array with the fetched API data.
- Replace hardcoded `channels` array with the channels from the currently selected workspace.

#### [MODIFY] `src/app/(dashboard)/messages/page.tsx`
- **Data Fetching:** Fetch the current workspace details (using a workspace ID from Zustand store or URL params) via `/api/workspaces/:workspaceId`.
- Replace the hardcoded "Online Team" with the actual `members` array populated from the workspace API response.
- Replace hardcoded "Workspace Details" (Pinned Links, Deadlines, Goals) with the real data fetched from the API.

## Verification Plan

### Manual Verification
- Create a new workspace via the API or a Postman request (with channels, pinned links, and goals).
- Log into the frontend and verify the Sidebar populates with the real Workspace name and Channels.
- Navigate to the Messages page and verify the Right Sidebar displays the correct Team Members, Pinned Links, and Team Goals.
- Click the CollabHub logo in the dashboard to ensure it navigates to `/dashboard` instead of logging out or going to the landing page.