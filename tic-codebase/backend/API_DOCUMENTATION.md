# TIC Backend API Documentation

Base URL: `http://localhost:8000/api`

**Server Configuration:**
- Host: `0.0.0.0` (accessible from any network interface)
- Port: `8000`
- Local access: `http://localhost:8000/api`
- Network access: `http://<your-ip>:8000/api`

## Table of Contents
- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
- [Job Endpoints](#job-endpoints)
- [Job Application Endpoints](#job-application-endpoints)
- [Saved Jobs Endpoints](#saved-jobs-endpoints)
- [Admin Endpoints](#admin-endpoints)

---

## Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## User Endpoints

### 1. Login

**Endpoint:** `POST /api/login`

**Authentication:** Not required

**Description:** Authenticates a user and returns JWT tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "date_joined": "2025-12-01T00:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "non_field_errors": ["Unable to log in with provided credentials."]
}
```

---

### 2. Pre-register (Teacher Registration)

**Endpoint:** `POST /api/pre-register`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Registers a new teacher with profile information

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | No | Password (min 8 chars). Auto-generated if not provided |
| firstName | string | Yes | First name (no numbers) |
| lastName | string | Yes | Last name (no numbers) |
| qualified | string | Yes | `yes` or `no` |
| english | string | Yes | `yes` or `no` |
| position | string | Yes | `teacher`, `leader`, or `other` |
| gender | string | Yes | `male`, `female`, or `others` |
| nationality | string | Yes | Nationality (min 2 chars) |
| secondNationality | boolean | No | Has second nationality |
| cvFile | file | No | CV file (PDF, DOC, DOCX, max 5MB) |
| hearFrom | string | No | How did you hear about us |
| role | string | No | `teacher`, `assistant_teacher`, or `senior_leader` |
| subject | string | No | Teaching subject |
| ageGroup | string | No | Age group taught |
| curriculum | array[string] | No | List of curricula (American, Australian, Canadian, IB Dip, IB MYP, IB PYP, Indian, IPC, New Zealand, South African, UK National) |
| leadershipRole | string | No | `coordinator`, `hod`, `assistant_principal`, or `principal` |
| exampleRadio | boolean | No | Job alerts preference |
| day | string | No | Available day (1-31) |
| month | string | No | Available month (1-12) |
| year | string | No | Available year (current year to +10 years) |

**Example Request (using curl):**
```bash
curl -X POST http://localhost:8000/api/pre-register \
  -F "email=teacher@example.com" \
  -F "password=securepass123" \
  -F "firstName=Jane" \
  -F "lastName=Smith" \
  -F "qualified=yes" \
  -F "english=yes" \
  -F "position=teacher" \
  -F "gender=female" \
  -F "nationality=American" \
  -F "secondNationality=false" \
  -F "cvFile=@/path/to/cv.pdf" \
  -F "role=teacher" \
  -F "subject=Mathematics" \
  -F "ageGroup=High School" \
  -F "curriculum=American" \
  -F "curriculum=IB Dip" \
  -F "exampleRadio=true" \
  -F "day=15" \
  -F "month=6" \
  -F "year=2026"
```

**Success Response (201 Created):**
```json
{
  "message": "Registration successful",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "email": "teacher@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "full_name": "Jane Smith",
    "date_joined": "2025-12-01T00:00:00Z"
  },
  "teacher_profile": {
    "id": 1,
    "qualified": "yes",
    "english": "yes",
    "position": "teacher",
    "gender": "female",
    "nationality": "American",
    "second_nationality": false,
    "cv_file": "http://localhost:8000/media/cvs/cv.pdf",
    "hear_from": "",
    "role": "teacher",
    "subject": "Mathematics",
    "age_group": "High School",
    "curriculum": ["American", "IB Dip"],
    "leadership_role": "",
    "job_alerts": true,
    "available_day": "15",
    "available_month": "6",
    "available_year": "2026",
    "available_from": "2026-6-15",
    "created_at": "2025-12-01T00:00:00Z",
    "updated_at": "2025-12-01T00:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "email": ["A user with this email already exists."],
  "firstName": ["First name cannot contain numbers."],
  "cvFile": ["File size cannot exceed 5.0MB."]
}
```

---

### 3. Update Password

**Endpoint:** `POST /api/update-password`

**Authentication:** Required (JWT)

**Description:** Updates the authenticated user's password

**Request Body:**
```json
{
  "current": "oldpassword123",
  "new": "newpassword456",
  "confirm": "newpassword456"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Responses (400 Bad Request):**

Invalid current password:
```json
{
  "current": ["Current password is incorrect."]
}
```

Passwords don't match:
```json
{
  "confirm": ["New password and confirmation do not match."]
}
```

New password same as current:
```json
{
  "new": ["New password must be different from current password."]
}
```

---

## Job Endpoints

### 4. Get Job List

**Endpoint:** `GET /api/jobs`

**Authentication:** Not required

**Description:** Retrieves a paginated list of jobs with optional filters

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| page_size | integer | No | Items per page (default: 6, max: 100) |
| title | string | No | Search by job title (case-insensitive) |
| jobType | string | No | Filter by job type (comma-separated): `remote`, `casual`, `full-time`, `part-time` |
| schoolType | string | No | Filter by school type (comma-separated): `public`, `private`, `charter`, `international` |
| gender | string | No | Filter by gender preference: `male`, `female`, `other`, `any` |
| status | string | No | Filter by status: `all`, `active`, `expired` (default: `active`) |
| is_applied | string | No | Filter by application status: `true` (only applied jobs), `false` (only non-applied jobs). **Requires authentication** |
| is_saved | string | No | Filter by saved status: `true` (only saved jobs), `false` (only non-saved jobs). **Requires authentication** |

**Example Requests:**

Basic filtering:
```bash
curl "http://localhost:8000/api/jobs?page=1&page_size=6&jobType=full-time,part-time&schoolType=private&status=active"
```

Get only saved jobs (requires authentication):
```bash
curl "http://localhost:8000/api/jobs?is_saved=true" \
  -H "Authorization: Bearer <access_token>"
```

Get only jobs the user has applied to (requires authentication):
```bash
curl "http://localhost:8000/api/jobs?is_applied=true" \
  -H "Authorization: Bearer <access_token>"
```

Get jobs that are neither saved nor applied (requires authentication):
```bash
curl "http://localhost:8000/api/jobs?is_saved=false&is_applied=false" \
  -H "Authorization: Bearer <access_token>"
```

**Success Response (200 OK):**
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/jobs?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Mathematics Teacher - High School",
      "school_name": "Springfield International School",
      "school_avatar": "https://via.placeholder.com/100",
      "location": "New York, USA",
      "job_type": "full-time",
      "school_type": "international",
      "status": "active",
      "gender_preference": "any",
      "summary": "We are seeking an experienced Mathematics teacher for our high school program.",
      "description": "Join our dynamic team of educators...",
      "requirements": "Bachelor's degree in Mathematics or Education\n5+ years teaching experience\nIB curriculum experience preferred",
      "level": "High School (Grades 9-12)",
      "subjects": ["Mathematics", "Algebra", "Calculus"],
      "date_posted": "2025-11-01T00:00:00Z",
      "closing_date": "2025-12-01",
      "is_expired": false,
      "is_applied": false,
      "is_saved": true,
      "created_at": "2025-11-01T00:00:00Z",
      "updated_at": "2025-11-01T00:00:00Z"
    }
  ]
}
```

**Note:** The `is_applied` and `is_saved` fields indicate whether the authenticated user has applied to or saved each job. For unauthenticated requests, these fields will always be `false`.

---

### 5. Get Job Detail

**Endpoint:** `GET /api/jobs/:id`

**Authentication:** Not required

**Description:** Retrieves details of a specific job

**URL Parameters:**
- `id` (integer): Job ID

**Example Request:**
```bash
curl http://localhost:8000/api/jobs/1
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "title": "Mathematics Teacher - High School",
  "school_name": "Springfield International School",
  "school_avatar": "https://via.placeholder.com/100",
  "location": "New York, USA",
  "job_type": "full-time",
  "school_type": "international",
  "status": "active",
  "gender_preference": "any",
  "summary": "We are seeking an experienced Mathematics teacher for our high school program.",
  "description": "Join our dynamic team of educators at Springfield International School...",
  "requirements": "Bachelor's degree in Mathematics or Education\n5+ years teaching experience\nIB curriculum experience preferred",
  "level": "High School (Grades 9-12)",
  "subjects": ["Mathematics", "Algebra", "Calculus"],
  "date_posted": "2025-11-01T00:00:00Z",
  "closing_date": "2025-12-01",
  "is_expired": false,
  "is_applied": false,
  "is_saved": true,
  "created_at": "2025-11-01T00:00:00Z",
  "updated_at": "2025-11-01T00:00:00Z"
}
```

**Note:** The `is_applied` and `is_saved` fields indicate whether the authenticated user has applied to or saved this job. For unauthenticated requests, these fields will always be `false`.

**Error Response (404 Not Found):**
```json
{
  "error": "Job not found"
}
```

---

## Job Application Endpoints

### 6. Apply to Job

**Endpoint:** `POST /api/jobs/:id/apply`

**Authentication:** Required (JWT)

**Content-Type:** `multipart/form-data`

**Description:** Submit a job application for a specific job

**URL Parameters:**
- `id` (integer): Job ID

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| resume | file | No | Resume file (PDF, DOC, DOCX, max 5MB) |
| cover_letter | file | No | Cover letter file (PDF, DOC, DOCX, max 5MB) |

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/jobs/1/apply \
  -H "Authorization: Bearer <access_token>" \
  -F "resume=@/path/to/resume.pdf" \
  -F "cover_letter=@/path/to/cover_letter.pdf"
```

**Success Response (201 Created):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job": 1,
    "job_title": "Mathematics Teacher - High School",
    "job_school": "Springfield International School",
    "resume": "http://localhost:8000/media/resumes/resume.pdf",
    "cover_letter": "http://localhost:8000/media/cover_letters/cover_letter.pdf",
    "status": "pending",
    "applied_at": "2025-12-01T00:00:00Z",
    "updated_at": "2025-12-01T00:00:00Z"
  }
}
```

**Error Responses (400 Bad Request):**

Job not active:
```json
{
  "error": "This job is no longer active"
}
```

Job expired:
```json
{
  "error": "This job has expired"
}
```

Already applied:
```json
{
  "error": "You have already applied to this job"
}
```

File validation error:
```json
{
  "resume": ["File size cannot exceed 5.0MB."],
  "cover_letter": ["Only pdf, doc, docx files are allowed."]
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Job not found"
}
```

---

## Saved Jobs Endpoints

### 7. Save Job

**Endpoint:** `POST /api/jobs/:id/save`

**Authentication:** Required (JWT)

**Description:** Save a job for later review

**URL Parameters:**
- `id` (integer): Job ID

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/jobs/1/save \
  -H "Authorization: Bearer <access_token>"
```

**Success Response (201 Created):**
```json
{
  "message": "Job saved successfully",
  "saved_job": {
    "id": 1,
    "job": 1,
    "job_details": {
      "id": 1,
      "title": "Mathematics Teacher - High School",
      "school_name": "Springfield International School",
      "school_avatar": "https://via.placeholder.com/100",
      "location": "New York, USA",
      "job_type": "full-time",
      "school_type": "international",
      "status": "active",
      "gender_preference": "any",
      "summary": "We are seeking an experienced Mathematics teacher for our high school program.",
      "description": "Join our dynamic team of educators...",
      "requirements": "Bachelor's degree in Mathematics or Education\n5+ years teaching experience\nIB curriculum experience preferred",
      "level": "High School (Grades 9-12)",
      "subjects": ["Mathematics", "Algebra", "Calculus"],
      "date_posted": "2025-11-01T00:00:00Z",
      "closing_date": "2025-12-01",
      "is_expired": false,
      "created_at": "2025-11-01T00:00:00Z",
      "updated_at": "2025-11-01T00:00:00Z"
    },
    "saved_at": "2025-12-01T00:00:00Z"
  }
}
```

**Error Responses (400 Bad Request):**

Already saved:
```json
{
  "error": "You have already saved this job"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Job not found"
}
```

---

### 8. Get Saved Jobs

**Endpoint:** `GET /api/saved-jobs`

**Authentication:** Required (JWT)

**Description:** Retrieve all jobs saved by the authenticated user

**Example Request:**
```bash
curl http://localhost:8000/api/saved-jobs \
  -H "Authorization: Bearer <access_token>"
```

**Success Response (200 OK):**
```json
{
  "count": 2,
  "saved_jobs": [
    {
      "id": 1,
      "job": 1,
      "job_details": {
        "id": 1,
        "title": "Mathematics Teacher - High School",
        "school_name": "Springfield International School",
        "school_avatar": "https://via.placeholder.com/100",
        "location": "New York, USA",
        "job_type": "full-time",
        "school_type": "international",
        "status": "active",
        "gender_preference": "any",
        "summary": "We are seeking an experienced Mathematics teacher for our high school program.",
        "description": "Join our dynamic team of educators...",
        "requirements": "Bachelor's degree in Mathematics or Education\n5+ years teaching experience\nIB curriculum experience preferred",
        "level": "High School (Grades 9-12)",
        "subjects": ["Mathematics", "Algebra", "Calculus"],
        "date_posted": "2025-11-01T00:00:00Z",
        "closing_date": "2025-12-01",
        "is_expired": false,
        "created_at": "2025-11-01T00:00:00Z",
        "updated_at": "2025-11-01T00:00:00Z"
      },
      "saved_at": "2025-12-01T00:00:00Z"
    }
  ]
}
```

---

### 9. Unsave Job (Remove from Saved)

**Endpoint:** `DELETE /api/jobs/:id/unsave`

**Authentication:** Required (JWT)

**Description:** Remove a job from saved list

**URL Parameters:**
- `id` (integer): Job ID

**Example Request:**
```bash
curl -X DELETE http://localhost:8000/api/jobs/1/unsave \
  -H "Authorization: Bearer <access_token>"
```

**Success Response (200 OK):**
```json
{
  "message": "Job removed from saved list"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Saved job not found"
}
```

---

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success (OK) |
| 201 | Success (Created) |
| 400 | Bad Request (Validation Error) |
| 401 | Unauthorized (Missing or invalid token) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Error Response Format

All validation errors follow this format:

```json
{
  "field_name": ["Error message 1", "Error message 2"]
}
```

For non-field errors:

```json
{
  "non_field_errors": ["Error message"]
}
```

---

## Notes for Frontend Integration

### JWT Token Management
1. Store both `access` and `refresh` tokens securely (e.g., httpOnly cookies or secure storage)
2. Access token expires in 1 day
3. Refresh token expires in 7 days
4. Include access token in Authorization header for protected endpoints

### File Uploads
1. Use `FormData` for multipart/form-data requests
2. Maximum file size: 5MB
3. Allowed file types: PDF, DOC, DOCX

### Pagination
1. Default page size is 6 items
2. Use `page` parameter to navigate pages
3. Use `next` and `previous` URLs in response for navigation

### Date Formats
- All dates are in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- Closing dates are in `YYYY-MM-DD` format

### CORS
Make sure to configure CORS settings if frontend is on a different domain/port.

### Example Frontend Code (JavaScript)

**Login:**
```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data.user;
  }

  throw new Error(data.non_field_errors?.[0] || 'Login failed');
};
```

**Get Jobs with Filters:**
```javascript
const getJobs = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page);
  if (filters.jobType) params.append('jobType', filters.jobType.join(','));
  if (filters.schoolType) params.append('schoolType', filters.schoolType.join(','));
  if (filters.title) params.append('title', filters.title);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.status) params.append('status', filters.status);

  const response = await fetch(`http://localhost:8000/api/jobs?${params}`);
  return await response.json();
};
```

**Apply to Job:**
```javascript
const applyToJob = async (jobId, resume, coverLetter) => {
  const formData = new FormData();
  if (resume) formData.append('resume', resume);
  if (coverLetter) formData.append('cover_letter', coverLetter);

  const token = localStorage.getItem('access_token');

  const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/apply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Application failed');
  }

  return data;
};
```

**Update Password:**
```javascript
const updatePassword = async (current, newPassword, confirm) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch('http://localhost:8000/api/update-password', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      current,
      new: newPassword,
      confirm
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.current?.[0] || data.new?.[0] || data.confirm?.[0] || 'Update failed');
  }

  return data;
};
```

---

## Admin Endpoints

**Note:** All admin endpoints require authentication with an admin/staff user account. Include the JWT token in the Authorization header.

### 1. Get Dashboard Statistics

**Endpoint:** `GET /api/admin/dashboard/stats`

**Authentication:** Required (Admin only)

**Description:** Get overview statistics for the admin dashboard

**Success Response (200 OK):**
```json
{
  "total_candidates": 150,
  "total_jobs": 45,
  "active_jobs": 30,
  "total_applications": 320,
  "pending_applications": 85,
  "recent_applications": 12,
  "recent_candidates": 8
}
```

---

### 2. Get All Candidates

**Endpoint:** `GET /api/admin/candidates`

**Authentication:** Required (Admin only)

**Description:** Get paginated list of all candidates/teachers with their profiles

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by name or email
- `qualified` (optional): Filter by qualified status (yes/no)
- `position` (optional): Filter by position (teacher/leader/other)
- `gender` (optional): Filter by gender (male/female/others)

**Example Request:**
```
GET /api/admin/candidates?page=1&search=john&qualified=yes
```

**Success Response (200 OK):**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/admin/candidates?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "email": "john.doe@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "full_name": "John Doe",
      "is_active": true,
      "date_joined": "2024-01-15T10:30:00Z",
      "total_applications": 5,
      "teacher_profile": {
        "id": 1,
        "qualified": "yes",
        "english": "yes",
        "position": "teacher",
        "gender": "male",
        "nationality": "United States",
        "second_nationality": false,
        "cv_file": "http://localhost:8000/media/cvs/john_cv.pdf",
        "hear_from": "LinkedIn",
        "role": "teacher",
        "subject": "Mathematics",
        "age_group": "High School",
        "curriculum": ["IB Dip", "American"],
        "leadership_role": null,
        "job_alerts": true,
        "available_day": "01",
        "available_month": "09",
        "available_year": "2024",
        "available_from": "2024-09-01",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    }
  ]
}
```

---

### 3. Get Candidate Details

**Endpoint:** `GET /api/admin/candidates/<candidate_id>`

**Authentication:** Required (Admin only)

**Description:** Get detailed information about a specific candidate including all their applications

**Success Response (200 OK):**
```json
{
  "candidate": {
    "id": 1,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "is_active": true,
    "date_joined": "2024-01-15T10:30:00Z",
    "total_applications": 5,
    "teacher_profile": { }
  },
  "applications": [
    {
      "id": 1,
      "applicant_email": "john.doe@example.com",
      "applicant_name": "John Doe",
      "resume": "http://localhost:8000/media/resumes/john_resume.pdf",
      "cover_letter": "http://localhost:8000/media/cover_letters/john_cover.pdf",
      "status": "pending",
      "applied_at": "2024-02-01T14:20:00Z",
      "updated_at": "2024-02-01T14:20:00Z"
    }
  ]
}
```

---

### 4. Get All Jobs (Admin View)

**Endpoint:** `GET /api/admin/jobs`

**Authentication:** Required (Admin only)

**Description:** Get paginated list of all jobs with application counts and applicant details

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by title or school name
- `job_type` (optional): Filter by job type (remote/casual/full-time/part-time)
- `school_type` (optional): Filter by school type (public/private/charter/international)
- `status` (optional): Filter by status (active/expired/closed)

**Example Request:**
```
GET /api/admin/jobs?page=1&search=teacher&status=active
```

---

### 5. Get Job Details (Admin View)

**Endpoint:** `GET /api/admin/jobs/<job_id>`

**Authentication:** Required (Admin only)

**Description:** Get detailed information about a specific job with all applicants

---

### 6. Update Application Status

**Endpoint:** `PATCH /api/admin/applications/<application_id>/status`

**Authentication:** Required (Admin only)

**Description:** Update the status of a job application

**Request Body:**
```json
{
  "status": "reviewed"
}
```

**Valid Status Values:**
- `pending` - Application submitted, not yet reviewed
- `reviewed` - Application has been reviewed
- `accepted` - Application accepted
- `rejected` - Application rejected

**Success Response (200 OK):**
```json
{
  "message": "Application status updated successfully",
  "application": {
    "id": 1,
    "status": "reviewed",
    "applied_at": "2024-02-01T14:20:00Z",
    "updated_at": "2024-02-05T16:30:00Z"
  }
}
```
