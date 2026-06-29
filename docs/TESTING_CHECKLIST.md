# CollabHub Manual Testing Checklist

The goal is simple: every important feature should be manually verified at least once.

---

## 1. Authentication Testing

### Register

#### Valid Registration

- [ ] Register with valid name
- [ ] Register with valid email
- [ ] Register with valid password

Expected:

- `201 Created`
- `success = true`

---

#### Invalid Registration

- [ ] Missing name
- [ ] Missing email
- [ ] Missing password
- [ ] Invalid email format
- [ ] Password < 6 chars
- [ ] Existing email

Expected:

- `400 Bad Request`

---

### Login

#### Valid Login

- [ ] Valid email/password

Expected:

- `200 OK`
- JWT returned

---

#### Invalid Login

- [ ] Wrong email
- [ ] Wrong password
- [ ] Empty credentials

Expected:

- `401 Unauthorized`

---

### Profile

- [ ] Valid token
- [ ] Missing token
- [ ] Invalid token

Expected:

- `200`
- `401`
- `401`

---

## 2. Workspace Testing

### Create Workspace

- [ ] Valid workspace
- [ ] Missing name
- [ ] Name too short

---

### Get Workspaces

- [ ] User sees own workspaces
- [ ] User cannot see unrelated workspaces

---

### Get Workspace By Id

- [ ] Member access
- [ ] Non-member access
- [ ] Invalid workspace id

Expected:

- `200`
- `403`
- `404`

---

### Add Member

- [ ] Owner adds member
- [ ] Non-owner adds member
- [ ] Invalid email
- [ ] Existing member

Expected:

- `200`
- `403`
- `404`
- `400`

---

### Update Role

- [ ] Owner promotes member
- [ ] Owner demotes admin
- [ ] Non-owner changes role
- [ ] Invalid role

Expected:

- `200`
- `200`
- `403`
- `400`

---

## 3. Task Testing

### Create Task

- [ ] Valid task
- [ ] Missing title
- [ ] Invalid priority
- [ ] Non-member creates task

---

### Get Tasks

Test:

- [ ] Pagination
- [ ] Search
- [ ] Status filter
- [ ] Priority filter
- [ ] Sorting

Examples:

- `?status=TODO`
- `?priority=HIGH`
- `?search=dashboard`
- `?page=1&limit=10`
- `?sortBy=dueDate`

---

### Assign Task

- [ ] Owner assigns task
- [ ] Admin assigns task
- [ ] Member assigns task
- [ ] Invalid user

Expected:

- `200`
- `200`
- `403`
- `404`

---

### Update Status

- [ ] TODO -> IN_PROGRESS
- [ ] IN_PROGRESS -> DONE
- [ ] Invalid status

---

### Delete Task

- [ ] Owner delete
- [ ] Admin delete
- [ ] Member delete

Expected:

- `200`
- `200`
- `403`

---

## 4. Comments Testing

### Add Comment

- [ ] Valid comment
- [ ] Empty comment
- [ ] Non-member comment

Expected:

- `201`
- `400`
- `403`

---

### Get Comments

- [ ] Task comments retrieved
- [ ] Non-member access denied

---

## 5. Activity Feed Testing

- [ ] Workspace creation logged
- [ ] Member addition logged
- [ ] Task creation logged
- [ ] Task assignment logged
- [ ] Status change logged
- [ ] Comment creation logged

---

## 6. Workspace Analytics Testing

Verify:

- [ ] totalTasks
- [ ] todoTasks
- [ ] inProgressTasks
- [ ] doneTasks
- [ ] completionRate
- [ ] assignedTasks
- [ ] overdueTasks

Create test tasks and confirm values manually.

---

## 7. Validation Testing

Verify every validator.

### Workspace

- [ ] Empty name
- [ ] Name < 3 chars

### Task

- [ ] Empty title
- [ ] Invalid priority

### Comment

- [ ] Empty content

### Auth

- [ ] Invalid email
- [ ] Short password

---

## 8. Security Testing

### JWT

- [ ] Missing token
- [ ] Invalid token
- [ ] Expired token

---

### Rate Limiter

Spam requests.

Expected:

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

### Helmet

Check response headers in Postman.

Verify:

- [ ] X-Content-Type-Options
- [ ] X-Frame-Options
- [ ] Content-Security-Policy
