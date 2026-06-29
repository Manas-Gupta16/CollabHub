# CollabHub API Documentation

## Base URL

http://localhost:5000/api

## Authentication

Protected routes require a JWT token.

Header:

```http
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### Register User

**POST** `/auth/register`

**Purpose**: Create a new user account.

**Request Body**:

```json
{
  "name": "Manas",
  "email": "manas@gmail.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Manas",
    "email": "manas@gmail.com"
  }
}
```

---

### Login User

**POST** `/auth/login`

**Purpose**: Authenticate an existing user and receive a JWT token.

**Request Body**:

```json
{
  "email": "manas@gmail.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {
      "_id": "...",
      "name": "Manas",
      "email": "manas@gmail.com"
    }
  }
}
```

---

### Get Profile

**GET** `/auth/profile`

**Purpose**: Fetch the profile of the authenticated user.

**Headers**:

```http
Authorization: Bearer <token>
```

**Response**:

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Manas",
    "email": "manas@gmail.com"
  }
}
```

---

## 2. Workspace Endpoints

### Create Workspace

**POST** `/workspaces`

**Purpose**: Create a new workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "name": "Project Alpha",
  "description": "Team workspace for the launch project"
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Project Alpha",
    "description": "Team workspace for the launch project",
    "owner": "...",
    "members": []
  }
}
```

---

### Get My Workspaces

**GET** `/workspaces`

**Purpose**: Retrieve all workspaces the current user belongs to.

**Headers**:

```http
Authorization: Bearer <token>
```

**Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Project Alpha",
      "description": "..."
    }
  ]
}
```

---

### Get Workspace by ID

**GET** `/workspaces/:id`

**Purpose**: Fetch a single workspace by its ID.

**Headers**:

```http
Authorization: Bearer <token>
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Project Alpha",
    "description": "...",
    "members": []
  }
}
```

---

### Add Member to Workspace

**POST** `/workspaces/:workspaceId/members`

**Purpose**: Add a user to a workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "email": "member@example.com",
  "role": "MEMBER"
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Project Alpha",
    "members": [
      {
        "user": "...",
        "role": "MEMBER"
      }
    ]
  }
}
```

---

### Update Member Role

**PATCH** `/workspaces/:workspaceId/members/role`

**Purpose**: Change a member's role in the workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "userId": "...",
  "role": "ADMIN"
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Project Alpha",
    "members": []
  }
}
```

---

### Get Workspace Stats

**GET** `/workspaces/:workspaceId/stats`

**Purpose**: Retrieve workspace statistics such as task counts and completion rate.

**Headers**:

```http
Authorization: Bearer <token>
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "totalTasks": 5,
    "todoTasks": 2,
    "inProgressTasks": 2,
    "doneTasks": 1,
    "highPriorityTasks": 1,
    "mediumPriorityTasks": 2,
    "lowPriorityTasks": 2,
    "totalMembers": 3,
    "completionRate": 20,
    "assignedTasks": 1,
    "overdueTasks": 0
  }
}
```

---

## 3. Task Endpoints

### Create Task

**POST** `/workspaces/:workspaceId/tasks`

**Purpose**: Create a new task inside a workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "title": "Design landing page",
  "description": "Create the initial UI draft",
  "priority": "HIGH",
  "dueDate": "2026-07-01"
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Design landing page",
    "status": "TODO",
    "priority": "HIGH"
  }
}
```

---

### Get Workspace Tasks

**GET** `/workspaces/:workspaceId/tasks`

**Purpose**: List tasks for a workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Supported Query Parameters**:

- `?status=TODO`
- `?status=IN_PROGRESS`
- `?status=DONE`
- `?priority=LOW`
- `?priority=MEDIUM`
- `?priority=HIGH`
- `?page=1&limit=10`
- `?sortBy=createdAt`
- `?sortBy=dueDate`
- `?sortBy=priority`

**Example Response**:

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "...",
        "title": "Design landing page",
        "status": "TODO",
        "priority": "HIGH"
      }
    ],
    "pagination": {
      "totalTasks": 1,
      "currentPage": 1,
      "totalPages": 1,
      "limit": 10
    }
  }
}
```

---

### Assign Task

**PATCH** `/tasks/:taskId/assign`

**Purpose**: Assign a task to a workspace member.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "assigneeId": "..."
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Design landing page",
    "assignee": "..."
  }
}
```

---

### Update Task Status

**PATCH** `/tasks/:taskId/status`

**Purpose**: Update the status of a task.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "status": "IN_PROGRESS"
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Design landing page",
    "status": "IN_PROGRESS"
  }
}
```

---

### Update Task

**PATCH** `/tasks/:taskId`

**Purpose**: Update task fields such as title, description, priority, or due date.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "title": "Updated task name",
  "priority": "MEDIUM"
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Updated task name",
    "priority": "MEDIUM"
  }
}
```

---

### Delete Task

**DELETE** `/tasks/:taskId`

**Purpose**: Delete a task from a workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "message": "Task deleted successfully"
  }
}
```

---

## 4. Comment Endpoints

### Add Comment

**POST** `/tasks/:taskId/comments`

**Purpose**: Add a comment to a task.

**Headers**:

```http
Authorization: Bearer <token>
```

**Request Body**:

```json
{
  "content": "This task looks good."
}
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "task": "...",
    "user": "...",
    "content": "This task looks good."
  }
}
```

---

### Get Task Comments

**GET** `/tasks/:taskId/comments`

**Purpose**: Retrieve all comments for a task.

**Headers**:

```http
Authorization: Bearer <token>
```

**Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "content": "This task looks good.",
      "user": {
        "name": "Manas",
        "email": "manas@gmail.com"
      }
    }
  ]
}
```

---

## 5. Activity Feed

### Get Workspace Activity

**GET** `/workspaces/:workspaceId/activity`

**Purpose**: Fetch the activity feed for a workspace.

**Headers**:

```http
Authorization: Bearer <token>
```

**Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "action": "TASK_CREATED",
      "details": "Created task: Design landing page",
      "user": {
        "name": "Manas",
        "email": "manas@gmail.com"
      }
    }
  ]
}
```

**Supported Activity Types**:

- `WORKSPACE_CREATED`
- `MEMBER_ADDED`
- `ROLE_UPDATED`
- `TASK_CREATED`
- `TASK_ASSIGNED`
- `TASK_STATUS_UPDATED`
- `TASK_DELETED`
- `TASK_COMMENTED`

---

## 6. Validation Rules

### Register

- Name: Required
- Email: Valid email required
- Password: Minimum 6 characters

### Workspace

- Name: Required
- Name: Minimum 3 characters

### Task

- Title: Required
- Title: Minimum 3 characters

### Comment

- Content: Required
- Content: Cannot be empty

---

## 7. Error Format

When the API returns an error, the response follows this structure:

```json
{
  "success": false,
  "status": "error",
  "message": "Workspace not found"
}
```

Common error cases include:

- Invalid credentials
- Missing or invalid token
- Workspace not found
- User not authorized to access a workspace
- Invalid task or comment payload
