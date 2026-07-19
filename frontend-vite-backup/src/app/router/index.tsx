import { createBrowserRouter } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import AuthLayout from "../layouts/AuthLayout"
import Dashboard from "../../features/dashboard/Dashboard"
import Login from "../../features/auth/Login"
import Register from "../../features/auth/Register"
import ForgotPassword from "../../features/auth/ForgotPassword"
import WorkspacesList from "../../features/workspaces/WorkspacesList"
import WorkspaceDetails from "../../features/workspaces/WorkspaceDetails"
import TaskBoard from "../../features/tasks/TaskBoard"
import Messages from "../../features/messages/Messages"
import Notifications from "../../features/notifications/Notifications"
import ActivityFeed from "../../features/activity/ActivityFeed"
import Profile from "../../features/profile/Profile"
import Settings from "../../features/settings/Settings"
import Analytics from "../../features/analytics/Analytics"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/workspaces", element: <WorkspacesList /> },
      { path: "/workspaces/:id", element: <WorkspaceDetails /> },
      { path: "/tasks", element: <TaskBoard /> },
      { path: "/analytics", element: <Analytics /> },
      { path: "/messages", element: <Messages /> },
      { path: "/messages/:channel", element: <Messages /> },
      { path: "/notifications", element: <Notifications /> },
      { path: "/activity", element: <ActivityFeed /> },
      { path: "/profile", element: <Profile /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
    ],
  },
])
