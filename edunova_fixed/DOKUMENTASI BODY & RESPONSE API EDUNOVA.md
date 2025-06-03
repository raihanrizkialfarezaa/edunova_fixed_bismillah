
# 1. Admin Dashboard & Instructor Management API

## Base URL

```
http://localhost:3000/api

```

## Authentication Header

```
Authorization: Bearer <your_jwt_token>
```

----------

## 1. Admin Dashboard API

### 1.1 Get Dashboard Statistics

**GET** `/admin/dashboard`

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

```

**Response Example:**

```json
{
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "statistics": {
      "users": {
        "total": 150,
        "students": 120,
        "instructors": 25,
        "newToday": 5,
        "newThisWeek": 20
      },
      "courses": {
        "total": 45,
        "published": 30,
        "draft": 10,
        "archived": 5,
        "newToday": 2
      },
      "enrollments": {
        "total": 300,
        "active": 250,
        "completed": 40,
        "dropped": 10,
        "newToday": 8
      },
      "revenue": {
        "total": 15000.50,
        "platform": 3000.10,
        "instructor": 12000.40,
        "thisMonth": 2500.00
      },
      "reviews": {
        "total": 85,
        "pending": 5,
        "approved": 80,
        "averageRating": "4.2"
      }
    },
    "recentActivities": {
      "users": [...],
      "courses": [...],
      "enrollments": [...]
    },
    "charts": {
      "monthlyRevenue": [...],
      "topCourses": [...]
    }
  }
}

```

### 1.2 Get All Users (Admin)

**GET** `/admin/users`

**Query Parameters:**

-   `page`: number (default: 1)
-   `limit`: number (default: 10)
-   `role`: STUDENT | INSTRUCTOR | ADMIN
-   `instructorStatus`: PENDING | APPROVED | REJECTED
-   `search`: string
-   `sortBy`: string (default: createdAt)
-   `sortOrder`: ASC | DESC (default: DESC)

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

```

**Example Request:**

```
GET /admin/users?page=1&limit=10&role=INSTRUCTOR&search=john

```

**Response Example:**

```json
{
  "message": "Users retrieved successfully",
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "INSTRUCTOR",
      "bio": "Experienced web developer",
      "expertise": ["JavaScript", "React"],
      "instructorStatus": "APPROVED",
      "courseCount": 3,
      "studentCount": 45,
      "totalRevenue": 2500.00,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

```

### 1.3 Get All Courses (Admin)

**GET** `/admin/courses`

**Query Parameters:**

-   `page`: number
-   `limit`: number
-   `status`: DRAFT | PUBLISHED | ARCHIVED
-   `categoryId`: number
-   `tagId`: number
-   `instructorId`: number
-   `search`: string
-   `sortBy`: string
-   `sortOrder`: ASC | DESC
-   `priceMin`: number
-   `priceMax`: number

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

```

**Response Example:**

```json
{
  "message": "Courses retrieved successfully",
  "courses": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript from scratch",
      "price": 99.99,
      "status": "PUBLISHED",
      "instructor": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "enrollmentStats": {
        "total": 25,
        "enrolled": 20,
        "completed": 5,
        "dropped": 0
      },
      "totalRevenue": 2499.75,
      "averageRating": "4.5",
      "reviewCount": 12,
      "totalLessons": 15,
      "totalDuration": 1200
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCourses": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

```

----------

## 2. Instructor Management API

### 2.1 Request to Become Instructor

**POST** `/users/instructor-request`

**Headers:**

```
Authorization: Bearer <student_jwt_token>
Content-Type: application/json

```

**Request Body:**

```json
{
  "bio": "I am a passionate web developer with 5 years of experience",
  "expertise": ["JavaScript", "React", "Node.js", "MongoDB"],
  "experience": "5 years as Full Stack Developer at Tech Company",
  "education": "Bachelor of Computer Science, XYZ University",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "website": "https://johndoe.com"
  },
  "phoneNumber": "+1234567890",
  "profileImage": "https://cloudinary.com/profile.jpg"
}

```

**Response Example:**

```json
{
  "message": "Instructor request submitted successfully. Please wait for admin approval.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "instructorStatus": "PENDING"
  }
}

```

### 2.2 Update Instructor Profile

**PUT** `/users/:id/instructor-profile`

**Headers:**

```
Authorization: Bearer <instructor_jwt_token>
Content-Type: application/json

```

**Request Body:**

```json
{
  "bio": "Updated bio description",
  "expertise": ["JavaScript", "React", "Vue.js"],
  "experience": "Updated experience",
  "education": "Updated education",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/updated",
    "twitter": "https://twitter.com/updated"
  },
  "phoneNumber": "+0987654321",
  "profileImage": "https://cloudinary.com/new-profile.jpg"
}

```

**Response Example:**

```json
{
  "message": "Instructor profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "INSTRUCTOR",
    "bio": "Updated bio description",
    "expertise": ["JavaScript", "React", "Vue.js"],
    "experience": "Updated experience",
    "education": "Updated education",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/updated",
      "twitter": "https://twitter.com/updated"
    },
    "phoneNumber": "+0987654321",
    "profileImage": "https://cloudinary.com/new-profile.jpg",
    "instructorStatus": "APPROVED"
  }
}

```

### 2.3 Get Instructor Profile

**GET** `/users/:id/instructor-profile`

**Headers:**

```
Content-Type: application/json

```

**Response Example:**

```json
{
  "message": "Instructor profile retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "INSTRUCTOR",
    "bio": "Experienced web developer",
    "expertise": ["JavaScript", "React"],
    "experience": "5 years",
    "education": "Bachelor of CS",
    "socialLinks": {...},
    "phoneNumber": "+1234567890",
    "profileImage": "https://...",
    "instructorStatus": "APPROVED",
    "instructorApprovedAt": "2024-01-20T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}

```

### 2.4 Get Instructor Requests (Admin Only)

**GET** `/admin/instructor-requests`

**Query Parameters:**

-   `status`: PENDING | APPROVED | REJECTED (default: PENDING)
-   `page`: number (default: 1)
-   `limit`: number (default: 10)

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

```

**Response Example:**

```json
{
  "message": "Instructor requests retrieved successfully",
  "data": {
    "users": [
      {
        "id": 5,
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "role": "STUDENT",
        "bio": "Passionate about teaching programming",
        "expertise": ["Python", "Django"],
        "experience": "3 years",
        "education": "MS Computer Science",
        "instructorStatus": "PENDING",
        "instructorRequestedAt": "2024-01-25T14:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10
    }
  }
}

```

### 2.5 Approve/Reject Instructor Request (Admin Only)

**PUT** `/admin/users/:id/approve-instructor`

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

```

**Request Body (Approve):**

```json
{
  "action": "approve"
}

```

**Request Body (Reject):**

```json
{
  "action": "reject",
  "rejectionReason": "Insufficient experience in the requested field"
}

```

**Response Example (Approve):**

```json
{
  "message": "Instructor request approved successfully",
  "user": {
    "id": 5,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "INSTRUCTOR",
    "instructorStatus": "APPROVED",
    "instructorApprovedAt": "2024-01-26T10:15:00.000Z"
  }
}

```

**Response Example (Reject):**

```json
{
  "message": "Instructor request rejected successfully",
  "user": {
    "id": 5,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "STUDENT",
    "instructorStatus": "REJECTED",
    "rejectionReason": "Insufficient experience in the requested field"
  }
}

```

### 2.6 Get All Approved Instructors (Public)

**GET** `/users/instructors`

**Query Parameters:**

-   `page`: number (default: 1)
-   `limit`: number (default: 12)
-   `search`: string
-   `expertise`: string

**Response Example:**

```json
{
  "message": "Instructors retrieved successfully",
  "data": {
    "instructors": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "bio": "Experienced web developer",
        "expertise": ["JavaScript", "React"],
        "experience": "5 years",
        "profileImage": "https://...",
        "totalCourses": 3,
        "Courses": [
          {
            "id": 1,
            "title": "JavaScript Basics",
            "price": 99.99,
            "thumbnail": "https://..."
          }
        ]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 12
    }
  }
}

```

### 2.7 Get Instructor Courses (Public)

**GET** `/users/:id/courses`

**Query Parameters:**

-   `page`: number (default: 1)
-   `limit`: number (default: 10)
-   `status`: string (default: PUBLISHED)

**Response Example:**

```json
{
  "message": "Instructor courses retrieved successfully",
  "data": {
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Experienced developer",
      "profileImage": "https://..."
    },
    "courses": [
      {
        "id": 1,
        "title": "JavaScript Fundamentals",
        "description": "Learn JS from scratch",
        "price": 99.99,
        "thumbnail": "https://...",
        "status": "PUBLISHED",
        "totalLessons": 20,
        "totalDuration": 1800,
        "totalEnrollments": 45,
        "Sections": [...]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 5,
      "itemsPerPage": 10
    }
  }
}

```

### 2.8 Get Instructor Statistics (Admin Only)

**GET** `/users/:id/stats`

**Query Parameters:**

-   `startDate`: YYYY-MM-DD
-   `endDate`: YYYY-MM-DD

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

```

**Response Example:**

```json
{
  "message": "Instructor statistics retrieved successfully",
  "data": {
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "instructorStatus": "APPROVED"
    },
    "statistics": {
      "courses": {
        "total": 5,
        "published": 4,
        "draft": 1,
        "archived": 0
      },
      "enrollments": {
        "total": 120
      },
      "revenue": {
        "total": 8500.00
      },
      "trends": {
        "monthlyEnrollments": [
          {
            "month": "2024-01",
            "enrollments": 15
          },
          {
            "month": "2024-02",
            "enrollments": 25
          }
        ]
      }
    }
  }
}

```

----------

## Error Response Examples

### 401 Unauthorized

```json
{
  "message": "No token provided"
}

```

### 403 Forbidden

```json
{
  "message": "Admin access required"
}

```

### 404 Not Found

```json
{
  "message": "User not found"
}

```

### 400 Bad Request

```json
{
  "message": "Action must be either 'approve' or 'reject'"
}

```

### 500 Internal Server Error

```json
{
  "message": "Failed to retrieve dashboard statistics",
  "error": "Database connection error"
}

```

----------

## Postman Collection Structure

```
LMS API Testing/
├── Admin Dashboard/
│   ├── Get Dashboard Stats
│   ├── Get All Users
│   └── Get All Courses
├── Instructor Management/
│   ├── Request Instructor
│   ├── Update Profile
│   ├── Get Profile
│   ├── Get Requests (Admin)
│   ├── Approve/Reject (Admin)
│   ├── Get All Instructors
│   ├── Get Instructor Courses
│   └── Get Instructor Stats
└── Environment Variables/
    ├── base_url: http://localhost:3000/api
    ├── admin_token: <admin_jwt_token>
    ├── instructor_token: <instructor_jwt_token>
    └── student_token: <student_jwt_token>
```

---

# 2. Authentication & Payout API

## Base URL

```
http://localhost:3000

```

## Headers yang Diperlukan

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

----------

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

```

**Response (201):**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```

**Role Options:** `STUDENT`, `INSTRUCTOR`, `ADMIN`

### 1.2 Login User

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}

```

**Response (200):**

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

```

### 1.3 Logout User

**POST** `/api/auth/logout`

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:** Empty

**Response (200):**

```json
{
  "message": "Logout successful"
}

```

### 1.4 Get Current User Info

**GET** `/api/auth/me`

**Headers Required:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "bio": null,
  "expertise": null,
  "experience": null,
  "education": null,
  "socialLinks": null,
  "phoneNumber": null,
  "profileImage": null,
  "instructorStatus": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}

```

### 1.5 Change Password

**PUT** `/api/auth/change-password`

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}

```

**Response (200):**

```json
{
  "message": "Password changed successfully"
}

```

----------

## 2. PAYOUT ENDPOINTS (INSTRUCTOR)

### 2.1 Create Payout Request

**POST** `/api/payouts`

**Headers Required:**

-   `Authorization: Bearer <instructor_token>`
-   `Content-Type: application/json`

**Request Body:**

```json
{
  "courseId": 1,
  "amount": 150.00,
  "method": "BANK_TRANSFER",
  "description": "Monthly payout for Web Development course"
}

```

**Method Options:** `BANK_TRANSFER`, `PAYPAL`

**Response (201):**

```json
{
  "message": "Payout request created successfully",
  "payout": {
    "id": 1,
    "amount": 150.00,
    "method": "BANK_TRANSFER",
    "status": "PENDING",
    "requestedAt": "2024-01-15T10:30:00.000Z",
    "processedAt": null,
    "instructorId": 2,
    "courseId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "instructor": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "course": {
      "id": 1,
      "title": "Complete Web Development Course"
    }
  },
  "availableAmount": 200.00,
  "pendingAmount": 150.00,
  "note": "Available amount will be reduced only when admin approves the payout"
}

```

### 2.2 Get Payout Details

**GET** `/api/payouts/{id}`

**Headers Required:** `Authorization: Bearer <token>`

**Response (200):**

```json
{
  "message": "Payout details retrieved successfully",
  "payout": {
    "id": 1,
    "amount": 150.00,
    "method": "BANK_TRANSFER",
    "status": "PENDING",
    "requestedAt": "2024-01-15T10:30:00.000Z",
    "processedAt": null,
    "instructorId": 2,
    "courseId": 1,
    "instructor": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "course": {
      "id": 1,
      "title": "Complete Web Development Course",
      "price": 299.99
    }
  }
}

```

### 2.3 Get Instructor's Own Payouts

**GET** `/api/payouts/instructor/my-payouts`

**Headers Required:** `Authorization: Bearer <instructor_token>`

**Query Parameters (Optional):**

-   `status` - Filter by status (PENDING, PROCESSING, COMPLETED, FAILED)
-   `courseId` - Filter by course ID
-   `page` - Page number (default: 1)
-   `limit` - Items per page (default: 10)

**Example:** `/api/payouts/instructor/my-payouts?status=PENDING&page=1&limit=5`

**Response (200):**

```json
{
  "message": "Instructor payouts retrieved successfully",
  "payouts": [
    {
      "id": 1,
      "amount": 150.00,
      "method": "BANK_TRANSFER",
      "status": "PENDING",
      "requestedAt": "2024-01-15T10:30:00.000Z",
      "processedAt": null,
      "instructorId": 2,
      "courseId": 1,
      "course": {
        "id": 1,
        "title": "Complete Web Development Course",
        "price": 299.99
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  },
  "summary": {
    "totalEarnings": 500.00,
    "totalCompletedPayouts": 200.00,
    "totalPendingPayouts": 150.00,
    "availableBalance": 300.00,
    "note": "Available balance only reflects completed payouts, not pending ones"
  }
}

```

### 2.4 Get Instructor's Total Balance

**GET** `/api/payouts/instructor/total-balance`

**Headers Required:** `Authorization: Bearer <instructor_token>`

**Response (200):**

```json
{
  "message": "Instructor total balance retrieved successfully",
  "balance": {
    "totalEarnings": 750.50,
    "totalCompletedPayouts": 200.00,
    "totalPendingPayouts": 150.00,
    "availableBalance": 550.50,
    "note": "Available balance only reflects completed payouts, pending payouts do not reduce available balance"
  },
  "courses": [
    {
      "courseId": 1,
      "courseTitle": "Complete Web Development Course",
      "coursePrice": 299.99,
      "courseStatus": "PUBLISHED",
      "enrollmentCount": 5,
      "totalEarnings": 450.00,
      "totalCompletedPayouts": 100.00,
      "totalPendingPayouts": 150.00,
      "availableBalance": 350.00,
      "enrollments": [
        {
          "id": 1,
          "studentName": "John Doe",
          "studentEmail": "john@example.com",
          "enrollmentStatus": "ACTIVE"
        }
      ]
    }
  ],
  "recentPayments": [
    {
      "id": 1,
      "amount": 89.97,
      "totalAmount": 299.99,
      "platformShare": 209.99,
      "courseName": "Complete Web Development Course",
      "studentName": "John Doe",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ],
  "recentPayouts": [
    {
      "id": 1,
      "amount": 150.00,
      "status": "PENDING",
      "method": "BANK_TRANSFER",
      "courseName": "Complete Web Development Course",
      "requestedAt": "2024-01-15T10:30:00.000Z",
      "processedAt": null
    }
  ],
  "summary": {
    "totalCourses": 2,
    "publishedCourses": 2,
    "totalEnrollments": 8,
    "totalCompletedPayments": 8,
    "averageEarningsPerCourse": 375.25,
    "averageEarningsPerEnrollment": 93.81
  }
}

```

### 2.5 Get Course Available Balance

**GET** `/api/payouts/course/{courseId}/balance`

**Headers Required:** `Authorization: Bearer <instructor_token>`

**Response (200):**

```json
{
  "message": "Course balance retrieved successfully",
  "courseId": 1,
  "courseTitle": "Complete Web Development Course",
  "instructorId": 2,
  "enrollments": [1, 2, 3],
  "payments": [
    {
      "id": 1,
      "totalAmount": 299.99,
      "instructorShare": 89.97,
      "status": "COMPLETED",
      "enrollmentId": 1,
      "instructorId": 2
    }
  ],
  "totalEarnings": 269.91,
  "totalCompletedPayouts": 0.00,
  "totalPendingPayouts": 150.00,
  "availableAmount": 269.91,
  "note": "Available amount only reflects completed payouts, not pending ones",
  "debug": {
    "enrollmentCount": 3,
    "paymentCount": 3,
    "completedPayments": 3
  }
}

```

### 2.6 Get Instructor Debug Info

**GET** `/api/payouts/debug/instructor-info`

**Headers Required:** `Authorization: Bearer <instructor_token>`

**Response (200):**

```json
{
  "message": "Instructor debug info",
  "instructor": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "INSTRUCTOR"
  },
  "courses": [
    {
      "id": 1,
      "title": "Complete Web Development Course",
      "price": 299.99,
      "status": "PUBLISHED"
    }
  ],
  "enrollments": [
    {
      "id": 1,
      "courseId": 1,
      "userId": 3,
      "status": "ACTIVE"
    }
  ],
  "payments": [
    {
      "id": 1,
      "totalAmount": 299.99,
      "instructorShare": 89.97,
      "status": "COMPLETED",
      "enrollmentId": 1,
      "instructorId": 2,
      "enrollment": {
        "id": 1,
        "courseId": 1,
        "course": {
          "id": 1,
          "title": "Complete Web Development Course"
        }
      }
    }
  ],
  "payouts": [
    {
      "id": 1,
      "amount": 150.00,
      "status": "PENDING",
      "courseId": 1,
      "requestedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "summary": {
    "totalCourses": 1,
    "totalEnrollments": 3,
    "totalPayments": 3,
    "completedPayments": 3,
    "totalPayouts": 1,
    "completedPayouts": 0,
    "pendingPayouts": 1
  }
}

```

----------

## 3. ADMIN PAYOUT ENDPOINTS

### 3.1 Update Payout Status (Admin Only)

**PUT** `/api/payouts/{id}/status`

**Headers Required:** `Authorization: Bearer <admin_token>`

**Request Body:**

```json
{
  "status": "COMPLETED",
  "rejectionReason": "Optional rejection reason if status is FAILED"
}

```

**Status Options:** `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`

**Response (200):**

```json
{
  "message": "Payout status updated successfully",
  "payout": {
    "id": 1,
    "amount": 150.00,
    "method": "BANK_TRANSFER",
    "status": "COMPLETED",
    "requestedAt": "2024-01-15T10:30:00.000Z",
    "processedAt": "2024-01-15T11:00:00.000Z",
    "instructorId": 2,
    "courseId": 1,
    "instructor": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "course": {
      "id": 1,
      "title": "Complete Web Development Course"
    }
  },
  "newAvailableBalance": 119.91,
  "note": "Available balance has been updated after payout completion"
}

```

### 3.2 Get Pending Payouts (Admin Only)

**GET** `/api/admin/payouts/pending`

**Headers Required:** `Authorization: Bearer <admin_token>`

**Query Parameters (Optional):**

-   `page` - Page number (default: 1)
-   `limit` - Items per page (default: 10)
-   `instructorId` - Filter by instructor ID
-   `courseId` - Filter by course ID

**Response (200):**

```json
{
  "message": "Pending payouts retrieved successfully",
  "payouts": [
    {
      "id": 2,
      "amount": 200.00,
      "method": "PAYPAL",
      "status": "PENDING",
      "requestedAt": "2024-01-15T12:00:00.000Z",
      "processedAt": null,
      "instructorId": 3,
      "courseId": 2,
      "instructor": {
        "id": 3,
        "name": "Bob Johnson",
        "email": "bob@example.com"
      },
      "course": {
        "id": 2,
        "title": "React.js Masterclass",
        "price": 199.99
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  },
  "summary": {
    "totalPendingAmount": 200.00,
    "totalPendingRequests": 1
  }
}

```

----------

## 4. ERROR RESPONSES

### 4.1 Authentication Errors

**401 Unauthorized:**

```json
{
  "message": "No token provided"
}

```

```json
{
  "message": "Invalid token"
}

```

```json
{
  "message": "Token revoked"
}

```

### 4.2 Authorization Errors

**403 Forbidden:**

```json
{
  "message": "Instructor access required"
}

```

```json
{
  "message": "Admin access required"
}

```

### 4.3 Validation Errors

**400 Bad Request:**

```json
{
  "message": "Course ID, amount, and method are required"
}

```

```json
{
  "message": "Invalid payment method. Must be BANK_TRANSFER or PAYPAL"
}

```

```json
{
  "message": "Insufficient funds. Available amount: 100.00"
}

```

### 4.4 Not Found Errors

**404 Not Found:**

```json
{
  "message": "Course not found or you are not the instructor"
}

```

```json
{
  "message": "Payout not found"
}

```

### 4.5 Server Errors

**500 Internal Server Error:**

```json
{
  "message": "Database connection error"
}

```

----------

# 3. Course & Category API

## Base URL

```
http://localhost:3000/api

```

## Headers Required for Protected Routes

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

----------

## 1. Category API

### 1.1 Get All Categories

-   **Method:** GET
-   **URL:** `/categories`
-   **Authentication:** None (Public)
-   **Headers:**

```json
{
  "Content-Type": "application/json"
}

```

-   **Body:** None
-   **Response:**

```json
[
  {
    "id": 1,
    "name": "Programming"
  },
  {
    "id": 2,
    "name": "Design"
  }
]

```

### 1.2 Create Category (Admin Only)

-   **Method:** POST
-   **URL:** `/categories/create`
-   **Authentication:** Required (Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "name": "Web Development"
}

```

-   **Response (Success - 201):**

```json
{
  "id": 3,
  "name": "Web Development"
}

```

-   **Response (Error - 400):**

```json
{
  "message": "Category name is required"
}

```

-   **Response (Error - 400):**

```json
{
  "message": "Category already exists"
}

```

### 1.3 Update Category (Admin Only)

-   **Method:** PUT
-   **URL:** `/categories/update/:id`
-   **Authentication:** Required (Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "name": "Advanced Programming"
}

```

-   **Response (Success - 200):**

```json
{
  "id": 1,
  "name": "Advanced Programming"
}

```

-   **Response (Error - 404):**

```json
{
  "message": "Category not found"
}

```

-   **Response (Error - 400):**

```json
{
  "message": "Category name already exists"
}

```

----------

## 2. Course API

### 2.1 Get All Courses

-   **Method:** GET
-   **URL:** `/courses`
-   **Authentication:** None (Public)
-   **Headers:**

```json
{
  "Content-Type": "application/json"
}

```

-   **Query Parameters (Optional):**

```
?page=1&limit=10&status=PUBLISHED&categoryId=1&tagId=2&search=javascript&instructorId=5&sortBy=createdAt&sortOrder=DESC

```

-   **Body:** None
-   **Response:**

```json
{
  "courses": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript from scratch",
      "price": 99.99,
      "thumbnail": "https://example.com/thumbnail.jpg",
      "status": "PUBLISHED",
      "instructorId": 2,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "deletedAt": null,
      "instructor": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com",
        "profileImage": "https://example.com/profile.jpg"
      },
      "Categories": [
        {
          "id": 1,
          "name": "Programming"
        }
      ],
      "Tags": [
        {
          "id": 1,
          "name": "JavaScript"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCourses": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

```

### 2.2 Get Course by ID

-   **Method:** GET
-   **URL:** `/courses/:id`
-   **Authentication:** None (Public)
-   **Headers:**

```json
{
  "Content-Type": "application/json"
}

```

-   **Body:** None
-   **Response:**

```json
{
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "price": 99.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "status": "PUBLISHED",
    "instructorId": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "deletedAt": null,
    "instructor": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://example.com/profile.jpg",
      "bio": "Experienced developer",
      "expertise": ["JavaScript", "React"]
    },
    "Categories": [
      {
        "id": 1,
        "name": "Programming"
      }
    ],
    "Tags": [
      {
        "id": 1,
        "name": "JavaScript"
      }
    ],
    "Sections": [
      {
        "id": 1,
        "title": "Introduction",
        "order": 1,
        "Lessons": [
          {
            "id": 1,
            "title": "What is JavaScript?",
            "duration": 600,
            "order": 1
          }
        ]
      }
    ],
    "Reviews": [
      {
        "id": 1,
        "rating": 5,
        "comment": "Great course!",
        "user": {
          "id": 3,
          "name": "Jane Smith",
          "profileImage": "https://example.com/jane.jpg"
        }
      }
    ],
    "averageRating": 4.5,
    "totalEnrollments": 150
  }
}

```

### 2.3 Create Course (Instructor/Admin Only)

-   **Method:** POST
-   **URL:** `/courses/create`
-   **Authentication:** Required (Instructor/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "title": "Advanced React Development",
  "description": "Master React with hooks, context, and advanced patterns",
  "price": 149.99,
  "thumbnail": "https://example.com/react-thumbnail.jpg",
  "categoryIds": [1, 2],
  "tagIds": [1, 3, 5]
}

```

-   **Response (Success - 201):**

```json
{
  "message": "Course created successfully",
  "course": {
    "id": 10,
    "title": "Advanced React Development",
    "description": "Master React with hooks, context, and advanced patterns",
    "price": 149.99,
    "thumbnail": "https://example.com/react-thumbnail.jpg",
    "status": "DRAFT",
    "instructorId": 2,
    "createdAt": "2024-01-20T14:30:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z",
    "deletedAt": null,
    "instructor": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "Categories": [
      {
        "id": 1,
        "name": "Programming"
      },
      {
        "id": 2,
        "name": "Web Development"
      }
    ],
    "Tags": [
      {
        "id": 1,
        "name": "JavaScript"
      },
      {
        "id": 3,
        "name": "React"
      },
      {
        "id": 5,
        "name": "Frontend"
      }
    ]
  }
}

```

-   **Response (Error - 400):**

```json
{
  "message": "Title, description, and price are required"
}

```

### 2.4 Update Course (Course Owner/Admin Only)

-   **Method:** PUT
-   **URL:** `/courses/:id`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "price": 199.99,
  "thumbnail": "https://example.com/new-thumbnail.jpg",
  "status": "PUBLISHED"
}

```

-   **Response (Success - 200):**

```json
{
  "message": "Course updated successfully",
  "course": {
    "id": 1,
    "title": "Updated Course Title",
    "description": "Updated description",
    "price": 199.99,
    "thumbnail": "https://example.com/new-thumbnail.jpg",
    "status": "PUBLISHED",
    "instructorId": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T15:00:00.000Z",
    "deletedAt": null,
    "instructor": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "Categories": [],
    "Tags": []
  }
}

```

### 2.5 Delete Course (Course Owner/Admin Only)

-   **Method:** DELETE
-   **URL:** `/courses/:id`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:** None
-   **Response (Success - 200):**

```json
{
  "message": "Course deleted successfully"
}

```

### 2.6 Update Course Status (Course Owner/Admin Only)

-   **Method:** PUT
-   **URL:** `/courses/:id/status`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "status": "PUBLISHED"
}

```

-   **Valid Status Values:** `DRAFT`, `PUBLISHED`, `ARCHIVED`
-   **Response (Success - 200):**

```json
{
  "message": "Course status updated successfully",
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "price": 99.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "status": "PUBLISHED",
    "instructorId": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T16:00:00.000Z",
    "deletedAt": null,
    "instructor": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}

```

### 2.7 Add Categories to Course (Course Owner/Admin Only)

-   **Method:** POST
-   **URL:** `/courses/:id/categories`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "categoryIds": [1, 2, 3]
}

```

-   **Response (Success - 200):**

```json
{
  "message": "Course categories updated successfully",
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "price": 99.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "status": "PUBLISHED",
    "instructorId": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "deletedAt": null,
    "Categories": [
      {
        "id": 1,
        "name": "Programming"
      },
      {
        "id": 2,
        "name": "Web Development"
      },
      {
        "id": 3,
        "name": "Frontend"
      }
    ]
  }
}

```

### 2.8 Add Tags to Course (Course Owner/Admin Only)

-   **Method:** POST
-   **URL:** `/courses/:id/tags`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:**

```json
{
  "tagIds": [1, 2, 4, 6]
}

```

-   **Response (Success - 200):**

```json
{
  "message": "Course tags updated successfully",
  "course": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "price": 99.99,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "status": "PUBLISHED",
    "instructorId": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "deletedAt": null,
    "Tags": [
      {
        "id": 1,
        "name": "JavaScript"
      },
      {
        "id": 2,
        "name": "Beginner"
      },
      {
        "id": 4,
        "name": "Programming"
      },
      {
        "id": 6,
        "name": "Tutorial"
      }
    ]
  }
}

```

----------

## 3. Course Analytics API

### 3.1 Get Course Analytics (Course Owner/Admin Only)

-   **Method:** GET
-   **URL:** `/courses/:id/analytics`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Body:** None
-   **Response:**

```json
{
  "analytics": {
    "courseInfo": {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "status": "PUBLISHED",
      "price": 99.99,
      "instructor": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    "enrollmentStats": {
      "total": 150,
      "byStatus": {
        "ENROLLED": 120,
        "COMPLETED": 25,
        "DROPPED": 5
      },
      "completionRate": 16.67,
      "averageProgress": 45.5
    },
    "reviewStats": {
      "totalReviews": 35,
      "averageRating": 4.3,
      "ratingDistribution": [
        {
          "rating": 5,
          "count": 20
        },
        {
          "rating": 4,
          "count": 10
        },
        {
          "rating": 3,
          "count": 3
        },
        {
          "rating": 2,
          "count": 1
        },
        {
          "rating": 1,
          "count": 1
        }
      ]
    },
    "monthlyTrends": [
      {
        "year": 2024,
        "month": 1,
        "enrollments": 45
      },
      {
        "year": 2024,
        "month": 2,
        "enrollments": 55
      },
      {
        "year": 2024,
        "month": 3,
        "enrollments": 50
      }
    ]
  }
}

```

### 3.2 Get Course Enrollment Trends (Course Owner/Admin Only)

-   **Method:** GET
-   **URL:** `/courses/:id/analytics/enrollments`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Query Parameters (Optional):**

```
?period=12

```

-   **Body:** None
-   **Response:**

```json
{
  "trends": {
    "period": "12 months",
    "enrollments": [
      {
        "year": 2024,
        "month": 1,
        "count": 45,
        "monthName": "January"
      },
      {
        "year": 2024,
        "month": 2,
        "count": 55,
        "monthName": "February"
      }
    ],
    "completions": [
      {
        "year": 2024,
        "month": 1,
        "count": 8,
        "monthName": "January"
      },
      {
        "year": 2024,
        "month": 2,
        "count": 12,
        "monthName": "February"
      }
    ],
    "dropouts": [
      {
        "year": 2024,
        "month": 1,
        "count": 2,
        "monthName": "January"
      },
      {
        "year": 2024,
        "month": 2,
        "count": 1,
        "monthName": "February"
      }
    ]
  }
}

```

### 3.3 Get Course Revenue Analytics (Course Owner/Admin Only)

-   **Method:** GET
-   **URL:** `/courses/:id/analytics/revenue`
-   **Authentication:** Required (Course Owner/Admin)
-   **Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

-   **Query Parameters (Optional):**

```
?period=12

```

-   **Body:** None
-   **Response:**

```json
{
  "revenue": {
    "courseInfo": {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "price": 99.99
    },
    "summary": {
      "totalRevenue": 14998.5,
      "totalEnrollments": 150,
      "currentPeriodRevenue": 5999.4,
      "previousPeriodRevenue": 4999.5,
      "revenueGrowth": 20.0,
      "averageMonthlyRevenue": 1249.87
    },
    "monthlyData": [
      {
        "year": 2024,
        "month": 1,
        "monthName": "January",
        "enrollments": 45,
        "revenue": 4499.55,
        "cumulativeRevenue": 4499.55
      },
      {
        "year": 2024,
        "month": 2,
        "monthName": "February",
        "enrollments": 55,
        "revenue": 5499.45,
        "cumulativeRevenue": 9999.0
      }
    ],
    "period": "12 months"
  }
}

```

----------

## Common Error Responses

### Authentication Errors

```json
{
  "message": "No token provided"
}

```

```json
{
  "message": "Invalid token"
}

```

```json
{
  "message": "Token revoked"
}

```

```json
{
  "message": "User not found"
}

```

### Authorization Errors

```json
{
  "message": "Authentication required"
}

```

```json
{
  "message": "Admin access required"
}

```

```json
{
  "message": "Instructor or admin access required"
}

```

```json
{
  "message": "You are not authorized to access this course"
}

```

### Validation Errors

```json
{
  "message": "Course ID is required"
}

```

```json
{
  "message": "Course not found"
}

```

```json
{
  "message": "Price must be a positive number"
}

```

```json
{
  "message": "Status must be one of: DRAFT, PUBLISHED, ARCHIVED"
}

```

### Server Errors

```json
{
  "message": "Internal server error message"
}

```

----------

# 4. Enrollment System API

## Autentikasi

```
Authorization: Bearer YOUR_JWT_TOKEN

```

----------

## 1. Enroll in Course

**Endpoint:** `POST /api/courses/{courseId}/enroll`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

**URL Parameters:**

-   `courseId` (integer): ID dari course yang ingin diikuti

**Request Body:** Tidak diperlukan

**Response Success (201):**

```json
{
  "message": "Successfully enrolled in course",
  "enrollment": {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "status": "ENROLLED",
    "progress": 0,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "payment": {
      "id": 1,
      "totalAmount": 99.99,
      "status": "PENDING",
      "paymentMethod": null,
      "enrollmentId": 1,
      "instructorId": 789,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  },
  "course": {
    "id": 456,
    "title": "JavaScript Fundamentals",
    "price": 99.99
  },
  "needsPayment": true
}

```

**Response Error (400) - Already Enrolled:**

```json
{
  "message": "Already enrolled in this course",
  "enrollment": {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "status": "ENROLLED",
    "progress": 25,
    "payment": {
      "id": 1,
      "status": "COMPLETED"
    }
  }
}

```

**Response Error (404):**

```json
{
  "message": "Course not found"
}

```

----------

## 2. Process Payment for Enrollment

**Endpoint:** `PUT /api/enrollments/{enrollmentId}/payment`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

**URL Parameters:**

-   `enrollmentId` (integer): ID dari enrollment

**Request Body:**

```json
{
  "paymentMethod": "CREDIT_CARD",
  "transactionId": "TXN_1642248600000"
}

```

**Request Body Fields:**

-   `paymentMethod` (enum): "CREDIT_CARD", "BANK_TRANSFER", atau "E_WALLET"
-   `transactionId` (string, optional): ID transaksi, jika tidak diberikan akan generate otomatis

**Response Success (200):**

```json
{
  "message": "Payment processed successfully",
  "enrollment": {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "status": "ENROLLED",
    "progress": 0,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "course": {
      "id": 456,
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript from basics to advanced",
      "price": 99.99,
      "thumbnail": "https://example.com/thumbnail.jpg",
      "instructorId": 789,
      "instructor": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    "payment": {
      "id": 1,
      "totalAmount": 99.99,
      "platformShare": 34.997,
      "instructorShare": 64.994,
      "status": "COMPLETED",
      "transactionId": "TXN_1642248600000",
      "paymentMethod": "CREDIT_CARD",
      "enrollmentId": 1,
      "instructorId": 789,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}

```

**Response Error (400) - Free Course:**

```json
{
  "message": "This course is free"
}

```

**Response Error (400) - Already Paid:**

```json
{
  "message": "Already paid for this course"
}

```

**Response Error (403):**

```json
{
  "message": "Access denied"
}

```

**Response Error (404):**

```json
{
  "message": "Enrollment not found"
}

```

----------

## 3. Get User Enrollments

**Endpoint:** `GET /api/my-enrollments`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

```

**Query Parameters (Optional):**

-   `status` (enum): "ENROLLED", "COMPLETED", atau "DROPPED"
-   `paymentStatus` (enum): "PENDING", "COMPLETED", "FAILED", atau "REFUNDED"

**Example URL:**

```
GET /api/my-enrollments?status=ENROLLED&paymentStatus=COMPLETED

```

**Response Success (200):**

```json
{
  "message": "User enrollments retrieved successfully",
  "enrollments": [
    {
      "id": 1,
      "userId": 123,
      "courseId": 456,
      "status": "ENROLLED",
      "progress": 75,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:45:00.000Z",
      "course": {
        "id": 456,
        "title": "JavaScript Fundamentals",
        "description": "Learn JavaScript from basics to advanced",
        "price": 99.99,
        "thumbnail": "https://example.com/thumbnail.jpg",
        "instructor": {
          "id": 789,
          "name": "John Doe",
          "email": "john@example.com"
        }
      },
      "payment": {
        "id": 1,
        "totalAmount": 99.99,
        "status": "COMPLETED",
        "paymentMethod": "CREDIT_CARD",
        "transactionId": "TXN_1642248600000"
      }
    }
  ]
}

```

----------

## 4. Update Course Progress

**Endpoint:** `PUT /api/courses/{courseId}/progress`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

```

**URL Parameters:**

-   `courseId` (integer): ID dari course

**Request Body:**

```json
{
  "lessonId": 789,
  "completed": true
}

```

**Request Body Fields:**

-   `lessonId` (integer): ID dari lesson yang diselesaikan
-   `completed` (boolean, optional): Default true, menandakan lesson diselesaikan

**Response Success (200):**

```json
{
  "message": "Progress updated successfully",
  "enrollment": {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "status": "ENROLLED",
    "progress": 80,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T12:00:00.000Z",
    "payment": {
      "id": 1,
      "totalAmount": 99.99,
      "status": "COMPLETED"
    }
  }
}

```

**Response Error (400) - No Lessons:**

```json
{
  "message": "No lessons found in this course"
}

```

**Response Error (404):**

```json
{
  "message": "Enrollment not found"
}

```

----------

## 5. Get Enrollment Details

**Endpoint:** `GET /api/enrollments/{id}`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

```

**URL Parameters:**

-   `id` (integer): ID dari enrollment

**Response Success (200):**

```json
{
  "message": "Enrollment details retrieved successfully",
  "enrollment": {
    "id": 1,
    "userId": 123,
    "courseId": 456,
    "status": "ENROLLED",
    "progress": 75,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T11:45:00.000Z",
    "course": {
      "id": 456,
      "title": "JavaScript Fundamentals",
      "description": "Learn JavaScript from basics to advanced",
      "price": 99.99,
      "thumbnail": "https://example.com/thumbnail.jpg",
      "status": "PUBLISHED",
      "instructorId": 789,
      "instructor": {
        "id": 789,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "Sections": [
        {
          "id": 1,
          "title": "Introduction",
          "order": 1,
          "courseId": 456,
          "Lessons": [
            {
              "id": 1,
              "title": "What is JavaScript?",
              "content": "Introduction to JavaScript programming language",
              "videoUrl": "https://example.com/video1.mp4",
              "duration": 600,
              "order": 1,
              "assignment": {
                "id": 1,
                "title": "Basic Assignment",
                "description": "Complete the basic exercises",
                "dueDate": "2025-01-20T23:59:59.000Z",
                "fileTypes": ["pdf", "docx"]
              },
              "quiz": {
                "id": 1,
                "title": "JavaScript Basics Quiz",
                "timeLimit": 1800
              }
            }
          ]
        }
      ]
    },
    "payment": {
      "id": 1,
      "totalAmount": 99.99,
      "platformShare": 34.997,
      "instructorShare": 64.994,
      "status": "COMPLETED",
      "transactionId": "TXN_1642248600000",
      "paymentMethod": "CREDIT_CARD",
      "enrollmentId": 1,
      "instructorId": 789,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}

```

**Response Error (403):**

```json
{
  "message": "Access denied"
}

```

**Response Error (404):**

```json
{
  "message": "Enrollment not found"
}

```

----------

## 6. Get Next Lesson

**Endpoint:** `GET /api/enrollments/{id}/next-lesson`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

```

**URL Parameters:**

-   `id` (integer): ID dari enrollment

**Response Success (200) - Has Next Lesson:**

```json
{
  "enrollment": {
    "id": 1,
    "courseId": 456,
    "courseTitle": "JavaScript Fundamentals",
    "studentName": "Alice Smith",
    "progress": 60,
    "isCompleted": false
  },
  "currentLesson": {
    "id": 3,
    "title": "Variables and Data Types",
    "content": "Learn about JavaScript variables and data types",
    "videoUrl": "https://example.com/video3.mp4",
    "duration": 720,
    "order": 3,
    "sectionTitle": "JavaScript Basics",
    "sectionOrder": 2,
    "assignment": null,
    "quiz": null
  },
  "nextLesson": {
    "id": 4,
    "title": "Functions in JavaScript",
    "content": "Understanding JavaScript functions",
    "videoUrl": "https://example.com/video4.mp4",
    "duration": 900,
    "order": 4,
    "sectionTitle": "JavaScript Basics",
    "sectionOrder": 2,
    "hasAssignment": true,
    "hasQuiz": false,
    "assignment": {
      "id": 2,
      "title": "Function Exercise",
      "description": "Create various JavaScript functions",
      "dueDate": "2025-01-25T23:59:59.000Z",
      "fileTypes": ["js", "html"]
    },
    "quiz": null
  },
  "courseProgress": {
    "currentLessonNumber": 4,
    "totalLessons": 10,
    "progressPercentage": 60,
    "lessonsCompleted": 6
  }
}

```

**Response Success (200) - Course Completed:**

```json
{
  "message": "Course completed! No more lessons available.",
  "enrollment": {
    "id": 1,
    "courseId": 456,
    "courseTitle": "JavaScript Fundamentals",
    "progress": 100,
    "isCompleted": true
  },
  "currentLesson": {
    "id": 10,
    "title": "Final Project",
    "content": "Complete your final JavaScript project",
    "videoUrl": "https://example.com/video10.mp4",
    "duration": 1800,
    "order": 10,
    "sectionTitle": "Advanced Topics",
    "sectionOrder": 5
  },
  "nextLesson": null,
  "totalLessons": 10
}

```

**Response Success (200) - No Lessons Found:**

```json
{
  "message": "No lessons found in this course",
  "enrollment": {
    "id": 1,
    "course": "JavaScript Fundamentals",
    "progress": 0
  }
}

```

**Response Error (403) - Student Access:**

```json
{
  "message": "You are not authorized to view this enrollment"
}

```

**Response Error (403) - Instructor Access:**

```json
{
  "message": "You are not authorized to view this enrollment"
}

```

**Response Error (404):**

```json
{
  "message": "Enrollment not found"
}

```

----------

## 7. Get Specific User's Enrollments (Admin/Instructor Only)

**Endpoint:** `GET /api/users/{userId}/enrollments`

**Headers:**

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}

```

**URL Parameters:**

-   `userId` (integer): ID dari user yang ingin dilihat enrollmentnya

**Query Parameters (Optional):**

-   `status` (enum): "ENROLLED", "COMPLETED", atau "DROPPED"
-   `paymentStatus` (enum): "PENDING", "COMPLETED", "FAILED", atau "REFUNDED"

**Response Success (200):**

```json
{
  "message": "User enrollments retrieved successfully",
  "enrollments": [
    {
      "id": 1,
      "userId": 123,
      "courseId": 456,
      "status": "ENROLLED",
      "progress": 75,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:45:00.000Z",
      "course": {
        "id": 456,
        "title": "JavaScript Fundamentals",
        "description": "Learn JavaScript from basics to advanced",
        "price": 99.99,
        "thumbnail": "https://example.com/thumbnail.jpg",
        "status": "PUBLISHED",
        "instructor": {
          "id": 789,
          "name": "John Doe",
          "email": "john@example.com"
        }
      },
      "payment": {
        "id": 1,
        "totalAmount": 99.99,
        "status": "COMPLETED",
        "paymentMethod": "CREDIT_CARD",
        "transactionId": "TXN_1642248600000",
        "platformShare": 34.997,
        "instructorShare": 64.994
      }
    }
  ]
}

```

**Response Error (403):**

```json
{
  "message": "Access denied"
}

```

----------

## Status Codes dan Error Handling

**Umum Error Responses:**

**401 Unauthorized:**

```json
{
  "message": "No token provided"
}

```

```json
{
  "message": "Invalid token"
}

```

```json
{
  "message": "Token revoked"
}

```

**500 Internal Server Error:**

```json
{
  "message": "Database connection error"
}

```

----------

# 5. Quiz & Assignment API


## Base URL

```
http://localhost:3000/api

```

## Authentication


```
Authorization: Bearer <your_jwt_token>

```

----------

## QUIZ ENDPOINTS

### 1. Create Quiz for Lesson

**POST** `/lessons/:id/quiz`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "title": "Quiz Matematika Dasar",
  "timeLimit": 30
}

```

**Response Success (201):**

```json
{
  "message": "Quiz created successfully",
  "quiz": {
    "id": 1,
    "title": "Quiz Matematika Dasar",
    "lessonId": 5,
    "timeLimit": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}

```

**Response Error (400):**

```json
{
  "message": "Quiz title is required"
}

```

----------

### 2. Get Quiz by ID

**GET** `/quizzes/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Response Success (200):**

```json
{
  "quiz": {
    "id": 1,
    "title": "Quiz Matematika Dasar",
    "lessonId": 5,
    "timeLimit": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "Questions": [
      {
        "id": 1,
        "text": "Berapa hasil dari 2 + 2?",
        "correctAnswer": "4",
        "points": 1,
        "Options": [
          {
            "id": 1,
            "text": "3"
          },
          {
            "id": 2,
            "text": "4"
          },
          {
            "id": 3,
            "text": "5"
          }
        ]
      }
    ],
    "lesson": {
      "id": 5,
      "title": "Pengenalan Matematika",
      "section": {
        "id": 2,
        "title": "Bab 1: Dasar-dasar",
        "course": {
          "id": 1,
          "title": "Kursus Matematika",
          "instructorId": 3
        }
      }
    }
  }
}

```

----------

### 3. Update Quiz

**PUT** `/quizzes/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "title": "Quiz Matematika Dasar - Updated",
  "timeLimit": 45
}

```

**Response Success (200):**

```json
{
  "message": "Quiz updated successfully",
  "quiz": {
    "id": 1,
    "title": "Quiz Matematika Dasar - Updated",
    "lessonId": 5,
    "timeLimit": 45,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z",
    "Questions": [
      {
        "id": 1,
        "text": "Berapa hasil dari 2 + 2?",
        "correctAnswer": "4",
        "points": 1,
        "Options": [
          {
            "id": 1,
            "text": "3"
          },
          {
            "id": 2,
            "text": "4"
          }
        ]
      }
    ]
  }
}

```

----------

### 4. Create Single Question for Quiz

**POST** `/quizzes/:id/questions`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "text": "Berapa hasil dari 5 x 3?",
  "correctAnswer": "15",
  "points": 2
}

```

**Response Success (201):**

```json
{
  "message": "Question created successfully",
  "question": {
    "id": 2,
    "text": "Berapa hasil dari 5 x 3?",
    "quizId": 1,
    "correctAnswer": "15",
    "points": 2,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}

```

----------

### 5. Create Multiple Questions for Quiz (Bulk)

**POST** `/quizzes/:id/questions/bulk`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "questions": [
    {
      "text": "Berapa hasil dari 10 - 3?",
      "correctAnswer": "7",
      "points": 1
    },
    {
      "text": "Berapa hasil dari 8 ÷ 2?",
      "correctAnswer": "4",
      "points": 2
    },
    {
      "text": "Berapa hasil dari 6 + 4?",
      "correctAnswer": "10"
    }
  ]
}

```

**Response Success (201):**

```json
{
  "message": "3 questions created successfully",
  "questions": [
    {
      "id": 3,
      "text": "Berapa hasil dari 10 - 3?",
      "quizId": 1,
      "correctAnswer": "7",
      "points": 1,
      "createdAt": "2024-01-15T11:15:00.000Z",
      "updatedAt": "2024-01-15T11:15:00.000Z"
    },
    {
      "id": 4,
      "text": "Berapa hasil dari 8 ÷ 2?",
      "quizId": 1,
      "correctAnswer": "4",
      "points": 2,
      "createdAt": "2024-01-15T11:15:00.000Z",
      "updatedAt": "2024-01-15T11:15:00.000Z"
    },
    {
      "id": 5,
      "text": "Berapa hasil dari 6 + 4?",
      "quizId": 1,
      "correctAnswer": "10",
      "points": 1,
      "createdAt": "2024-01-15T11:15:00.000Z",
      "updatedAt": "2024-01-15T11:15:00.000Z"
    }
  ],
  "count": 3
}

```

----------

### 6. Update Question

**PUT** `/questions/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "text": "Berapa hasil dari 5 x 3? (Updated)",
  "correctAnswer": "15",
  "points": 3
}

```

**Response Success (200):**

```json
{
  "message": "Question updated successfully",
  "question": {
    "id": 2,
    "text": "Berapa hasil dari 5 x 3? (Updated)",
    "quizId": 1,
    "correctAnswer": "15",
    "points": 3,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "Options": [
      {
        "id": 4,
        "text": "10"
      },
      {
        "id": 5,
        "text": "15"
      },
      {
        "id": 6,
        "text": "20"
      }
    ]
  }
}

```

----------

### 7. Create Multiple Options for Question (Bulk)

**POST** `/questions/:id/options/bulk`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "options": [
    {
      "text": "10"
    },
    {
      "text": "15"
    },
    {
      "text": "20"
    },
    {
      "text": "25"
    }
  ]
}

```

**Response Success (201):**

```json
{
  "message": "4 options created successfully",
  "options": [
    {
      "id": 7,
      "text": "10",
      "questionId": 2,
      "createdAt": "2024-01-15T12:15:00.000Z",
      "updatedAt": "2024-01-15T12:15:00.000Z"
    },
    {
      "id": 8,
      "text": "15",
      "questionId": 2,
      "createdAt": "2024-01-15T12:15:00.000Z",
      "updatedAt": "2024-01-15T12:15:00.000Z"
    },
    {
      "id": 9,
      "text": "20",
      "questionId": 2,
      "createdAt": "2024-01-15T12:15:00.000Z",
      "updatedAt": "2024-01-15T12:15:00.000Z"
    },
    {
      "id": 10,
      "text": "25",
      "questionId": 2,
      "createdAt": "2024-01-15T12:15:00.000Z",
      "updatedAt": "2024-01-15T12:15:00.000Z"
    }
  ],
  "count": 4
}

```

----------

### 8. Create Options for Multiple Questions (Bulk)

**POST** `/quizzes/:id/options/bulk`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "questionsWithOptions": [
    {
      "questionId": 3,
      "options": [
        {
          "text": "5"
        },
        {
          "text": "7"
        },
        {
          "text": "9"
        }
      ]
    },
    {
      "questionId": 4,
      "options": [
        {
          "text": "2"
        },
        {
          "text": "4"
        },
        {
          "text": "6"
        },
        {
          "text": "8"
        }
      ]
    }
  ]
}

```

**Response Success (201):**

```json
{
  "message": "7 options created successfully for 2 questions",
  "optionsByQuestion": {
    "3": [
      {
        "id": 11,
        "text": "5",
        "questionId": 3,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      },
      {
        "id": 12,
        "text": "7",
        "questionId": 3,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      },
      {
        "id": 13,
        "text": "9",
        "questionId": 3,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      }
    ],
    "4": [
      {
        "id": 14,
        "text": "2",
        "questionId": 4,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      },
      {
        "id": 15,
        "text": "4",
        "questionId": 4,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      },
      {
        "id": 16,
        "text": "6",
        "questionId": 4,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      },
      {
        "id": 17,
        "text": "8",
        "questionId": 4,
        "createdAt": "2024-01-15T12:30:00.000Z",
        "updatedAt": "2024-01-15T12:30:00.000Z"
      }
    ]
  },
  "totalOptionsCreated": 7,
  "questionsCount": 2
}

```

----------

### 9. Get All Quizzes (Admin & Instructor Only)

**GET** `/quizzes?page=1&limit=10&search=matematika`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Query Parameters:**

-   `page` (optional): Halaman (default: 1)
-   `limit` (optional): Jumlah item per halaman (default: 10)
-   `search` (optional): Pencarian berdasarkan title quiz, lesson, atau course

**Response Success (200):**

```json
{
  "quizzes": [
    {
      "id": 1,
      "title": "Quiz Matematika Dasar",
      "lessonId": 5,
      "timeLimit": 30,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "Questions": [
        {
          "id": 1,
          "text": "Berapa hasil dari 2 + 2?",
          "correctAnswer": "4",
          "points": 1,
          "Options": [
            {
              "id": 1,
              "text": "3"
            },
            {
              "id": 2,
              "text": "4"
            }
          ]
        }
      ],
      "lesson": {
        "id": 5,
        "title": "Pengenalan Matematika",
        "section": {
          "id": 2,
          "title": "Bab 1: Dasar-dasar",
          "course": {
            "id": 1,
            "title": "Kursus Matematika",
            "instructorId": 3,
            "instructor": {
              "id": 3,
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}

```

----------

### 10. Get Quizzes for Specific Course

**GET** `/courses/:courseId/quizzes?page=1&limit=10`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Query Parameters:**

-   `page` (optional): Halaman (default: 1)
-   `limit` (optional): Jumlah item per halaman (default: 10)

**Response Success (200):**

```json
{
  "course": {
    "id": 1,
    "title": "Kursus Matematika",
    "instructor": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "quizzes": [
    {
      "id": 1,
      "title": "Quiz Matematika Dasar",
      "lessonId": 5,
      "timeLimit": 30,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "Questions": [
        {
          "id": 1,
          "text": "Berapa hasil dari 2 + 2?",
          "correctAnswer": "4",
          "points": 1,
          "Options": [
            {
              "id": 1,
              "text": "3"
            },
            {
              "id": 2,
              "text": "4"
            }
          ]
        }
      ],
      "lesson": {
        "id": 5,
        "title": "Pengenalan Matematika",
        "order": 1,
        "section": {
          "id": 2,
          "title": "Bab 1: Dasar-dasar",
          "order": 1,
          "course": {
            "id": 1,
            "title": "Kursus Matematika"
          }
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}

```

----------

### 11. Get Quiz for Specific Lesson

**GET** `/lessons/:lessonId/quiz`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Response Success (200) - For Students:**

```json
{
  "quiz": {
    "id": 1,
    "title": "Quiz Matematika Dasar",
    "lessonId": 5,
    "timeLimit": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "Questions": [
      {
        "id": 1,
        "text": "Berapa hasil dari 2 + 2?",
        "points": 1,
        "Options": [
          {
            "id": 1,
            "text": "3"
          },
          {
            "id": 2,
            "text": "4"
          },
          {
            "id": 3,
            "text": "5"
          }
        ]
      }
    ],
    "lesson": {
      "id": 5,
      "title": "Pengenalan Matematika",
      "section": {
        "id": 2,
        "title": "Bab 1: Dasar-dasar",
        "course": {
          "id": 1,
          "title": "Kursus Matematika"
        }
      }
    }
  },
  "lesson": {
    "id": 5,
    "title": "Pengenalan Matematika",
    "section": {
      "id": 2,
      "title": "Bab 1: Dasar-dasar",
      "course": {
        "id": 1,
        "title": "Kursus Matematika"
      }
    }
  }
}

```

**Response Success (200) - For Instructors/Admin:**

```json
{
  "quiz": {
    "id": 1,
    "title": "Quiz Matematika Dasar",
    "lessonId": 5,
    "timeLimit": 30,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "Questions": [
      {
        "id": 1,
        "text": "Berapa hasil dari 2 + 2?",
        "correctAnswer": "4",
        "points": 1,
        "Options": [
          {
            "id": 1,
            "text": "3"
          },
          {
            "id": 2,
            "text": "4"
          },
          {
            "id": 3,
            "text": "5"
          }
        ]
      }
    ],
    "lesson": {
      "id": 5,
      "title": "Pengenalan Matematika",
      "section": {
        "id": 2,
        "title": "Bab 1: Dasar-dasar",
        "course": {
          "id": 1,
          "title": "Kursus Matematika"
        }
      }
    }
  },
  "lesson": {
    "id": 5,
    "title": "Pengenalan Matematika",
    "section": {
      "id": 2,
      "title": "Bab 1: Dasar-dasar",
      "course": {
        "id": 1,
        "title": "Kursus Matematika"
      }
    }
  }
}

```

----------

## ASSIGNMENT ENDPOINTS

### 12. Create Assignment for Lesson

**POST** `/lessons/:id/assignment`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "title": "Tugas Matematika Bab 1",
  "description": "Kerjakan soal-soal latihan di buku halaman 15-20",
  "dueDate": "2024-02-15T23:59:59.000Z",
  "fileTypes": ["pdf", "doc", "docx"]
}

```

**Response Success (201):**

```json
{
  "message": "Assignment created successfully",
  "assignment": {
    "id": 1,
    "title": "Tugas Matematika Bab 1",
    "description": "Kerjakan soal-soal latihan di buku halaman 15-20",
    "lessonId": 5,
    "dueDate": "2024-02-15T23:59:59.000Z",
    "fileTypes": ["pdf", "doc", "docx"],
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z"
  }
}

```

**Response Error (400):**

```json
{
  "message": "Assignment title and due date are required"
}

```

**Response Error (400) - Invalid file types:**

```json
{
  "message": "Invalid file types: exe, bat. Allowed types: pdf, doc, docx, txt, jpg, jpeg, png, zip, rar"
}

```

----------

### 13. Get Assignment by ID

**GET** `/assignments/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Response Success (200):**

```json
{
  "assignment": {
    "id": 1,
    "title": "Tugas Matematika Bab 1",
    "description": "Kerjakan soal-soal latihan di buku halaman 15-20",
    "lessonId": 5,
    "dueDate": "2024-02-15T23:59:59.000Z",
    "fileTypes": ["pdf", "doc", "docx"],
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T13:00:00.000Z",
    "lesson": {
      "id": 5,
      "title": "Pengenalan Matematika",
      "section": {
        "id": 2,
        "title": "Bab 1: Dasar-dasar",
        "course": {
          "id": 1,
          "title": "Kursus Matematika",
          "instructorId": 3
        }
      }
    }
  }
}

```

----------

### 14. Update Assignment

**PUT** `/assignments/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>",
  "Content-Type": "application/json"
}

```

**Body (JSON):**

```json
{
  "title": "Tugas Matematika Bab 1 - Updated",
  "description": "Kerjakan soal-soal latihan di buku halaman 15-25",
  "dueDate": "2024-02-20T23:59:59.000Z",
  "fileTypes": ["pdf", "doc", "docx", "txt"]
}

```

**Response Success (200):**

```json
{
  "message": "Assignment updated successfully",
  "assignment": {
    "id": 1,
    "title": "Tugas Matematika Bab 1 - Updated",
    "description": "Kerjakan soal-soal latihan di buku halaman 15-25",
    "lessonId": 5,
    "dueDate": "2024-02-20T23:59:59.000Z",
    "fileTypes": ["pdf", "doc", "docx", "txt"],
    "createdAt": "2024-01-15T13:00:00.000Z",
    "updatedAt": "2024-01-15T14:00:00.000Z",
    "lesson": {
      "id": 5,
      "title": "Pengenalan Matematika"
    }
  }
}

```

----------

### 15. Get All Assignments (Admin & Instructor Only)

**GET** `/assignments?page=1&limit=10&search=matematika&status=active`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Query Parameters:**

-   `page` (optional): Halaman (default: 1)
-   `limit` (optional): Jumlah item per halaman (default: 10)
-   `search` (optional): Pencarian berdasarkan title assignment
-   `status` (optional): Status filter

**Response Success (200):**

```json
{
  "assignments": [
    {
      "id": 1,
      "title": "Tugas Matematika Bab 1",
      "description": "Kerjakan soal-soal latihan di buku halaman 15-20",
      "lessonId": 5,
      "dueDate": "2024-02-15T23:59:59.000Z",
      "fileTypes": ["pdf", "doc", "docx"],
      "createdAt": "2024-01-15T13:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z",
      "lesson": {
        "id": 5,
        "title": "Pengenalan Matematika",
        "order": 1,
        "section": {
          "id": 2,
          "title": "Bab 1: Dasar-dasar",
          "order": 1,
          "course": {
            "id": 1,
            "title": "Kursus Matematika",
            "status": "PUBLISHED",
            "instructorId": 3,
            "instructor": {
              "id": 3,
              "name": "John Doe",
              "email": "john@example.com"
            }
          }
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}

```

----------

### 16. Get Assignments for Specific Course

**GET** `/courses/:courseId/assignments?page=1&limit=10&search=tugas`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Query Parameters:**

-   `page` (optional): Halaman (default: 1)
-   `limit` (optional): Jumlah item per halaman (default: 10)
-   `search` (optional): Pencarian berdasarkan title assignment

**Response Success (200):**

```json
{
  "course": {
    "id": 1,
    "title": "Kursus Matematika",
    "instructor": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "assignments": [
    {
      "id": 1,
      "title": "Tugas Matematika Bab 1",
      "description": "Kerjakan soal-soal latihan di buku halaman 15-20",
      "lessonId": 5,
      "dueDate": "2024-02-15T23:59:59.000Z",
      "fileTypes": ["pdf", "doc", "docx"],
      "createdAt": "2024-01-15T13:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z",
      "lesson": {
        "id": 5,
        "title": "Pengenalan Matematika",
        "order": 1,
        "section": {
          "id": 2,
          "title": "Bab 1: Dasar-dasar",
          "order": 1
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}

```

----------

### 17. Get Assignment for Specific Lesson

**GET** `/lessons/:lessonId/assignment`

**Headers:**

```json
{
  "Authorization": "Bearer <your_jwt_token>"
}

```

**Response Success (200):**

```json
{
  "assignment": {
    "id": 1,
    "title": "Tugas Matematika Bab 1",
    "description": "Kerjakan soal-soal latihan di buku

```

# 6. Create Lesson & Section with Video Uploads

## Base URL

```
http://localhost:3000/api

```

## Authentication

Sebagian besar endpoint memerlukan JWT token. Setelah login, gunakan token di header:

```
Authorization: Bearer <your_jwt_token>

```

----------

## 1. SECTION MANAGEMENT API

### 1.1 Create Section

**POST** `/courses/:id/sections/create`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

**URL Params:**

-   `id` (required): Course ID

**Body:**

```json
{
  "title": "Introduction to JavaScript",
  "order": 1
}

```

**Response Success (201):**

```json
{
  "message": "Section created successfully",
  "section": {
    "id": 1,
    "title": "Introduction to JavaScript",
    "order": 1,
    "courseId": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}

```

**Response Error (400):**

```json
{
  "message": "Section title is required"
}

```

**Response Error (403):**

```json
{
  "message": "You are not authorized to add sections to this course"
}

```

**Response Error (404):**

```json
{
  "message": "Course not found"
}

```

### 1.2 Get Course Sections

**GET** `/courses/:id/sections`

**URL Params:**

-   `id` (required): Course ID

**Query Params:**

-   `includeLessons` (optional): "true" or "false" (default: "false")

**Example URLs:**

```
GET /courses/5/sections
GET /courses/5/sections?includeLessons=true

```

**Response Success (200) - Without Lessons:**

```json
{
  "message": "Course sections retrieved successfully",
  "sections": [
    {
      "id": 1,
      "title": "Introduction to JavaScript",
      "order": 1,
      "courseId": 5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Advanced Concepts",
      "order": 2,
      "courseId": 5,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "course": {
    "id": 5,
    "title": "Complete JavaScript Course"
  }
}

```

**Response Success (200) - With Lessons:**

```json
{
  "message": "Course sections retrieved successfully",
  "sections": [
    {
      "id": 1,
      "title": "Introduction to JavaScript",
      "order": 1,
      "courseId": 5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "Lessons": [
        {
          "id": 1,
          "title": "What is JavaScript?",
          "duration": 300,
          "order": 1,
          "videoUrl": "https://res.cloudinary.com/ddsmpjipq/video/upload/v1705312200/courses/5/sections/1/lessons/lesson-1705312200123.mp4"
        }
      ]
    }
  ],
  "course": {
    "id": 5,
    "title": "Complete JavaScript Course"
  }
}

```

### 1.3 Update Section

**PUT** `/sections/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

**URL Params:**

-   `id` (required): Section ID

**Body:**

```json
{
  "title": "Updated Section Title",
  "order": 2
}

```

**Response Success (200):**

```json
{
  "message": "Section updated successfully",
  "section": {
    "id": 1,
    "title": "Updated Section Title",
    "order": 2,
    "courseId": 5,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z",
    "Lessons": []
  }
}

```

### 1.4 Delete Section

**DELETE** `/sections/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>"
}

```

**URL Params:**

-   `id` (required): Section ID

**Response Success (200):**

```json
{
  "message": "Section deleted successfully"
}

```

**Response Error (400):**

```json
{
  "message": "Cannot delete section that contains lessons. Please delete all lessons first."
}

```

### 1.5 Reorder Sections

**PUT** `/courses/:id/sections/reorder`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

**URL Params:**

-   `id` (required): Course ID

**Body:**

```json
{
  "sectionOrders": [
    { "id": 2, "order": 1 },
    { "id": 1, "order": 2 },
    { "id": 3, "order": 3 }
  ]
}

```

**Response Success (200):**

```json
{
  "message": "Sections reordered successfully",
  "sections": [
    {
      "id": 2,
      "title": "Advanced Topics",
      "order": 1,
      "courseId": 5
    },
    {
      "id": 1,
      "title": "Introduction",
      "order": 2,
      "courseId": 5
    }
  ]
}

```

----------

## 2. LESSON MANAGEMENT API

### 2.1 Create Lesson (with Video Upload)

**POST** `/sections/:id/lessons`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "multipart/form-data"
}

```

**URL Params:**

-   `id` (required): Section ID

**Form Data:**

```
title: "Introduction to Variables"
content: "In this lesson, we'll learn about JavaScript variables..."
duration: 450
order: 1
video: [FILE] (optional - video file: mp4, avi, mov, wmv, webm, mkv, flv)

```

**Response Success (201):**

```json
{
  "message": "Lesson created successfully",
  "lesson": {
    "id": 1,
    "title": "Introduction to Variables",
    "content": "In this lesson, we'll learn about JavaScript variables...",
    "videoUrl": "https://res.cloudinary.com/ddsmpjipq/video/upload/v1705312200/courses/5/sections/1/lessons/lesson-1705312200123.mp4",
    "videoPublicId": "courses/5/sections/1/lessons/lesson-1705312200123",
    "duration": 450,
    "order": 1,
    "sectionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "videoUploaded": true
}

```

**Response Error (400) - File too large:**

```json
{
  "message": "File too large. Maximum size is 500MB"
}

```

**Response Error (400) - Invalid file type:**

```json
{
  "message": "Only video files are allowed (mp4, avi, mov, wmv, webm, mkv, flv)"
}

```

### 2.2 Get Section Lessons

**GET** `/sections/:id/lessons`

**URL Params:**

-   `id` (required): Section ID

**Response Success (200):**

```json
{
  "message": "Section lessons retrieved successfully",
  "lessons": [
    {
      "id": 1,
      "title": "Introduction to Variables",
      "content": "In this lesson, we'll learn about JavaScript variables...",
      "videoUrl": "https://res.cloudinary.com/ddsmpjipq/video/upload/v1705312200/courses/5/sections/1/lessons/lesson-1705312200123.mp4",
      "videoPublicId": "courses/5/sections/1/lessons/lesson-1705312200123",
      "duration": 450,
      "order": 1,
      "sectionId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "section": {
    "id": 1,
    "title": "Introduction to JavaScript",
    "course": {
      "id": 5,
      "title": "Complete JavaScript Course"
    }
  }
}

```

### 2.3 Get Lesson by ID

**GET** `/lessons/:id`

**URL Params:**

-   `id` (required): Lesson ID

**Response Success (200):**

```json
{
  "message": "Lesson retrieved successfully",
  "lesson": {
    "id": 1,
    "title": "Introduction to Variables",
    "content": "In this lesson, we'll learn about JavaScript variables...",
    "videoUrl": "https://res.cloudinary.com/ddsmpjipq/video/upload/v1705312200/courses/5/sections/1/lessons/lesson-1705312200123.mp4",
    "videoPublicId": "courses/5/sections/1/lessons/lesson-1705312200123",
    "duration": 450,
    "order": 1,
    "sectionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "section": {
      "id": 1,
      "title": "Introduction to JavaScript",
      "course": {
        "id": 5,
        "title": "Complete JavaScript Course",
        "instructorId": 2,
        "instructor": {
          "id": 2,
          "name": "John Doe",
          "email": "john@example.com"
        }
      }
    }
  }
}

```

### 2.4 Update Lesson (with Optional Video Upload)

**PUT** `/lessons/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "multipart/form-data"
}

```

**URL Params:**

-   `id` (required): Lesson ID

**Form Data:**

```
title: "Updated Lesson Title"
content: "Updated lesson content..."
duration: 500
order: 2
video: [FILE] (optional - new video file)

```

**Response Success (200):**

```json
{
  "message": "Lesson updated successfully",
  "lesson": {
    "id": 1,
    "title": "Updated Lesson Title",
    "content": "Updated lesson content...",
    "videoUrl": "https://res.cloudinary.com/ddsmpjipq/video/upload/v1705315800/courses/5/sections/1/lessons/lesson-1-1705315800456.mp4",
    "videoPublicId": "courses/5/sections/1/lessons/lesson-1-1705315800456",
    "duration": 500,
    "order": 2,
    "sectionId": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  },
  "videoUpdated": true
}

```

### 2.5 Delete Lesson

**DELETE** `/lessons/:id`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>"
}

```

**URL Params:**

-   `id` (required): Lesson ID

**Response Success (200):**

```json
{
  "message": "Lesson deleted successfully"
}

```

### 2.6 Reorder Lessons

**PUT** `/sections/:id/lessons/reorder`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

**URL Params:**

-   `id` (required): Section ID

**Body:**

```json
{
  "lessonOrders": [
    { "id": 3, "order": 1 },
    { "id": 1, "order": 2 },
    { "id": 2, "order": 3 }
  ]
}

```

**Response Success (200):**

```json
{
  "message": "Lessons reordered successfully",
  "lessons": [
    {
      "id": 3,
      "title": "Advanced Topics",
      "order": 1,
      "sectionId": 1
    },
    {
      "id": 1,
      "title": "Introduction",
      "order": 2,
      "sectionId": 1
    }
  ]
}

```

----------

## 3. VIDEO STREAMING API

### 3.1 Stream Video (Authenticated)

**GET** `/lessons/:lessonId/stream`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>"
}

```

**URL Params:**

-   `lessonId` (required): Lesson ID

**Response Success (302):**

```
Redirect to Cloudinary video URL

```

**Response Error (403):**

```json
{
  "message": "You need to enroll in this course to access video content"
}

```

**Response Error (403) - Payment Required:**

```json
{
  "message": "Payment required to access video content",
  "paymentStatus": "PENDING"
}

```

### 3.2 Get Video Info

**GET** `/lessons/:lessonId/video-info`

**Headers:**

```json
{
  "Authorization": "Bearer <jwt_token>"
}

```

**URL Params:**

-   `lessonId` (required): Lesson ID

**Response Success (200):**

```json
{
  "videoUrl": "https://res.cloudinary.com/ddsmpjipq/video/upload/v1705312200/courses/5/sections/1/lessons/lesson-1705312200123.mp4",
  "duration": 450,
  "title": "Introduction to Variables",
  "lessonId": 1
}

```

### 3.3 Preview Video Stream

**GET** `/lessons/:lessonId/preview`

**URL Params:**

-   `lessonId` (required): Lesson ID (hanya untuk lesson pertama dari section pertama)

**Response Success (302):**

```
Redirect to Cloudinary video URL (untuk demo/preview)

```

**Response Error (401) - For non-preview lessons:**

```json
{
  "message": "Authentication required"
}

```

----------

## 4. COMMON ERROR RESPONSES

### Authentication Errors

```json
{
  "message": "No token provided"
}

```

```json
{
  "message": "Invalid token"
}

```

```json
{
  "message": "Token revoked"
}

```

### Authorization Errors

```json
{
  "message": "Instructor or admin access required"
}

```

```json
{
  "message": "You are not authorized to access this course"
}

```

### Validation Errors

```json
{
  "message": "Section title is required"
}

```

```json
{
  "message": "Lesson title and content are required"
}

```

### Not Found Errors

```json
{
  "message": "Course not found"
}

```

```json
{
  "message": "Section not found"
}

```

```json
{
  "message": "Lesson not found"
}

```

----------

## 5. POSTMAN COLLECTION SETUP

### Environment Variables

```json
{
  "base_url": "http://localhost:3000/api",
  "jwt_token": "your_jwt_token_here",
  "course_id": "5",
  "section_id": "1",
  "lesson_id": "1"
}

```

### Pre-request Script (untuk authenticated endpoints)

```javascript
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('jwt_token')
});

```

### Test Scripts

```javascript
// Test untuk response sukses
pm.test("Status code is 200 or 201", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});

pm.test("Response has message", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('message');
});

// Simpan ID untuk request selanjutnya
const responseJson = pm.response.json();
if (responseJson.section && responseJson.section.id) {
    pm.environment.set("section_id", responseJson.section.id);
}
if (responseJson.lesson && responseJson.lesson.id) {
    pm.environment.set("lesson_id", responseJson.lesson.id);
}

```

----------

# 7. Quiz & Assignment Submission

## Base URL

```
http://localhost:3000/api

```

## Authentication Header

```
Authorization: Bearer <your_jwt_token>
```

----------

## 1. Get Quiz for Taking

### Endpoint

```
GET /quizzes/{quizId}/take

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Response Success (200)

```json
{
  "quiz": {
    "id": 1,
    "title": "JavaScript Basics Quiz",
    "timeLimit": 60,
    "lesson": {
      "id": 1,
      "title": "Introduction to JavaScript",
      "section": {
        "id": 1,
        "title": "Web Development Fundamentals",
        "course": {
          "id": 1,
          "title": "Full Stack Web Development"
        }
      }
    },
    "questions": [
      {
        "id": 1,
        "text": "What is JavaScript?",
        "points": 10,
        "options": [
          {
            "id": 1,
            "text": "A programming language"
          },
          {
            "id": 2,
            "text": "A markup language"
          },
          {
            "id": 3,
            "text": "A database"
          }
        ]
      }
    ]
  }
}

```

### Response Error (404)

```json
{
  "message": "Quiz not found"
}

```

### Response Error (403)

```json
{
  "message": "You must be enrolled in this course to take this quiz"
}

```

### Response Error (400) - Already Submitted

```json
{
  "message": "You have already submitted this quiz",
  "submission": {
    "id": 1,
    "score": 85.5,
    "status": "GRADED",
    "submittedAt": "2025-05-26T10:30:00.000Z"
  }
}

```

----------

## 2. Submit Quiz

### Endpoint

```
POST /quizzes/{quizId}/submit

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Request Body

```json
{
  "answers": [
    {
      "questionId": 1,
      "selectedOptionId": 1
    },
    {
      "questionId": 2,
      "selectedOptionId": 3
    }
  ]
}

```

### Response Success (201)

```json
{
  "message": "Quiz submitted and graded successfully",
  "submission": {
    "id": 1,
    "score": 85.5,
    "earnedPoints": 17,
    "totalPoints": 20,
    "status": "GRADED",
    "submittedAt": "2025-05-26T10:30:00.000Z"
  }
}

```

### Response Error (400)

```json
{
  "message": "Answers array is required and must not be empty"
}

```

### Response Error (400) - Invalid Format

```json
{
  "message": "Each answer must have questionId and selectedOptionId"
}

```

### Response Error (400) - Missing Questions

```json
{
  "message": "Missing answers for question IDs: 1, 3"
}

```

### Response Error (400) - Invalid Questions

```json
{
  "message": "Invalid question IDs: 5, 6"
}

```

### Response Error (400) - Invalid Options

```json
{
  "message": "Invalid option ID 10 for question 1"
}

```

----------

## 3. Get Quiz Results

### Endpoint

```
GET /quizzes/{quizId}/results

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Response Success (200)

```json
{
  "submission": {
    "id": 1,
    "score": 85.5,
    "earnedPoints": 17,
    "totalPoints": 20,
    "status": "GRADED",
    "submittedAt": "2025-05-26T10:30:00.000Z",
    "gradedAt": "2025-05-26T10:30:00.000Z",
    "feedback": "Good job! Review the concepts you missed."
  },
  "quiz": {
    "id": 1,
    "title": "JavaScript Basics Quiz",
    "timeLimit": 60,
    "lesson": {
      "id": 1,
      "title": "Introduction to JavaScript",
      "section": {
        "id": 1,
        "title": "Web Development Fundamentals",
        "course": {
          "id": 1,
          "title": "Full Stack Web Development"
        }
      }
    }
  },
  "questions": [
    {
      "id": 1,
      "text": "What is JavaScript?",
      "points": 10,
      "correctAnswer": "A programming language",
      "userAnswer": {
        "selectedOptionId": 1,
        "selectedOptionText": "A programming language",
        "isCorrect": true,
        "pointsEarned": 10
      },
      "options": [
        {
          "id": 1,
          "text": "A programming language",
          "isCorrect": true,
          "isSelected": true
        },
        {
          "id": 2,
          "text": "A markup language",
          "isCorrect": false,
          "isSelected": false
        }
      ]
    }
  ]
}

```

### Response Error (404)

```json
{
  "message": "Quiz submission not found"
}

```

----------

## 4. Submit Assignment

### Endpoint

```
POST /assignments/{assignmentId}/submit

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>"
}

```

**Note:** Jangan tambahkan `Content-Type` untuk multipart/form-data, Postman akan menambahkannya otomatis.

### Request Body (form-data)

```
file: [Select File] (Required)
description: "This is my assignment submission" (Optional)

```

### Response Success (201)

```json
{
  "message": "Assignment submitted successfully",
  "submission": {
    "id": 1,
    "fileName": "assignment1.pdf",
    "fileType": "pdf",
    "fileSize": 1024000,
    "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/edunova/assignments/assignment_1_user_1_1234567890.pdf",
    "downloadUrl": "https://res.cloudinary.com/your-cloud/image/upload/fl_attachment/edunova/assignments/assignment_1_user_1_1234567890.pdf",
    "description": "This is my assignment submission",
    "isLate": false,
    "status": "SUBMITTED",
    "submittedAt": "2025-05-26T10:30:00.000Z"
  }
}

```

### Response Error (400) - No File

```json
{
  "message": "File is required for assignment submission"
}

```

### Response Error (400) - Invalid File Type

```json
{
  "message": "File type .exe is not allowed. Allowed types: pdf, doc, docx, txt, jpg, jpeg, png, zip, rar"
}

```

### Response Error (400) - Already Submitted

```json
{
  "message": "You have already submitted this assignment"
}

```

### Response Error (500) - Upload Failed

```json
{
  "message": "Failed to upload file. Please try again.",
  "error": "Upload failed"
}

```

----------

## 5. Get Submission by ID

### Endpoint

```
GET /submissions/{submissionId}?type={quiz|assignment}

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Query Parameters

-   `type`: Required. Either "quiz" or "assignment"

### Response Success (200) - Quiz Submission

```json
{
  "submission": {
    "id": 1,
    "userId": 1,
    "quizId": 1,
    "answers": [
      {
        "questionId": 1,
        "selectedOptionId": 1
      }
    ],
    "score": 85.5,
    "totalPoints": 20,
    "earnedPoints": 17,
    "status": "GRADED",
    "submittedAt": "2025-05-26T10:30:00.000Z",
    "gradedAt": "2025-05-26T10:30:00.000Z",
    "gradedBy": 2,
    "feedback": "Good work!",
    "student": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "grader": {
      "id": 2,
      "name": "Jane Teacher",
      "email": "jane@example.com"
    },
    "quiz": {
      "id": 1,
      "title": "JavaScript Basics Quiz",
      "lesson": {
        "id": 1,
        "title": "Introduction to JavaScript",
        "section": {
          "id": 1,
          "title": "Web Development Fundamentals",
          "course": {
            "id": 1,
            "title": "Full Stack Web Development",
            "instructorId": 2
          }
        }
      }
    }
  }
}

```

### Response Success (200) - Assignment Submission

```json
{
  "submission": {
    "id": 1,
    "userId": 1,
    "assignmentId": 1,
    "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/edunova/assignments/assignment_1_user_1_1234567890.pdf",
    "fileName": "assignment1.pdf",
    "fileType": "pdf",
    "fileSize": 1024000,
    "downloadUrl": "https://res.cloudinary.com/your-cloud/image/upload/fl_attachment/edunova/assignments/assignment_1_user_1_1234567890.pdf",
    "description": "My assignment submission",
    "isLate": false,
    "status": "GRADED",
    "score": 90,
    "maxScore": 100,
    "submittedAt": "2025-05-26T10:30:00.000Z",
    "gradedAt": "2025-05-26T11:30:00.000Z",
    "gradedBy": 2,
    "feedback": "Excellent work!",
    "student": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "grader": {
      "id": 2,
      "name": "Jane Teacher",
      "email": "jane@example.com"
    },
    "assignment": {
      "id": 1,
      "title": "JavaScript Project",
      "dueDate": "2025-05-30T23:59:59.000Z",
      "lesson": {
        "id": 1,
        "title": "Introduction to JavaScript",
        "section": {
          "id": 1,
          "title": "Web Development Fundamentals",
          "course": {
            "id": 1,
            "title": "Full Stack Web Development",
            "instructorId": 2
          }
        }
      }
    }
  }
}

```

### Response Error (400)

```json
{
  "message": "Type parameter is required (quiz or assignment)"
}

```

### Response Error (403)

```json
{
  "message": "You are not authorized to view this submission"
}

```

----------

## 6. Grade Submission

### Endpoint

```
PUT /submissions/{submissionId}/grade?type={quiz|assignment}

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Query Parameters

-   `type`: Required. Either "quiz" or "assignment"

### Request Body

```json
{
  "score": 85.5,
  "feedback": "Good work! Keep practicing the concepts you missed."
}

```

### Response Success (200)

```json
{
  "message": "Submission graded successfully",
  "submission": {
    "id": 1,
    "userId": 1,
    "score": 85.5,
    "feedback": "Good work! Keep practicing the concepts you missed.",
    "status": "GRADED",
    "gradedAt": "2025-05-26T11:30:00.000Z",
    "gradedBy": 2,
    "student": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "grader": {
      "id": 2,
      "name": "Jane Teacher",
      "email": "jane@example.com"
    }
  }
}

```

### Response Error (400) - Invalid Score

```json
{
  "message": "Quiz score must be between 0 and 100"
}

```

### Response Error (403)

```json
{
  "message": "You are not authorized to grade this submission"
}

```

----------

## 7. Get Student's Own Submissions

### Endpoint

```
GET /student/submissions

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Query Parameters (Optional)

-   `type`: "quiz" or "assignment" (default: all)
-   `status`: "SUBMITTED", "GRADED", "LATE_SUBMITTED" (default: all)
-   `courseId`: Course ID filter (default: all)
-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 10)

### Example URL

```
GET /student/submissions?type=quiz&status=GRADED&page=1&limit=5

```

### Response Success (200)

```json
{
  "submissions": [
    {
      "id": 1,
      "type": "quiz",
      "title": "JavaScript Basics Quiz",
      "course": {
        "id": 1,
        "title": "Full Stack Web Development"
      },
      "lesson": {
        "id": 1,
        "title": "Introduction to JavaScript"
      },
      "section": {
        "id": 1,
        "title": "Web Development Fundamentals"
      },
      "score": 85.5,
      "totalPoints": 20,
      "earnedPoints": 17,
      "status": "GRADED",
      "submittedAt": "2025-05-26T10:30:00.000Z",
      "gradedAt": "2025-05-26T11:30:00.000Z",
      "feedback": "Good work!",
      "grader": {
        "id": 2,
        "name": "Jane Teacher"
      },
      "timeLimit": 60
    },
    {
      "id": 2,
      "type": "assignment",
      "title": "JavaScript Project",
      "course": {
        "id": 1,
        "title": "Full Stack Web Development"
      },
      "lesson": {
        "id": 1,
        "title": "Introduction to JavaScript"
      },
      "section": {
        "id": 1,
        "title": "Web Development Fundamentals"
      },
      "score": 90,
      "maxScore": 100,
      "status": "GRADED",
      "submittedAt": "2025-05-26T10:30:00.000Z",
      "gradedAt": "2025-05-26T11:30:00.000Z",
      "feedback": "Excellent!",
      "grader": {
        "id": 2,
        "name": "Jane Teacher"
      },
      "isLate": false,
      "dueDate": "2025-05-30T23:59:59.000Z",
      "fileName": "assignment1.pdf",
      "fileType": "pdf",
      "fileSize": 1024000,
      "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/edunova/assignments/assignment_1_user_1_1234567890.pdf",
      "downloadUrl": "https://res.cloudinary.com/your-cloud/image/upload/fl_attachment/edunova/assignments/assignment_1_user_1_1234567890.pdf",
      "description": "My assignment submission",
      "allowedFileTypes": ["pdf", "doc", "docx"]
    }
  ],
  "statistics": {
    "quiz": {
      "total": 5,
      "graded": 4,
      "pending": 1,
      "averageScore": 82.5
    },
    "assignment": {
      "total": 3,
      "graded": 2,
      "pending": 1,
      "late": 0,
      "averageScore": 88.0
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 8,
    "itemsPerPage": 10
  },
  "filters": {
    "type": "all",
    "status": "all",
    "courseId": "all"
  }
}

```

----------

## 8. Get Instructor's Submissions for Grading

### Endpoint

```
GET /instructor/submissions

```

### Headers

```json
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

```

### Query Parameters (Optional)

-   `courseId`: Course ID filter (default: all instructor's courses)
-   `status`: "SUBMITTED", "GRADED", "LATE_SUBMITTED" (default: all)
-   `type`: "quiz" or "assignment" (default: all)
-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 10)

### Example URL

```
GET /instructor/submissions?courseId=1&status=SUBMITTED&type=assignment&page=1&limit=5

```

### Response Success (200)

```json
{
  "submissions": [
    {
      "id": 1,
      "submissionType": "quiz",
      "userId": 1,
      "quizId": 1,
      "answers": [
        {
          "questionId": 1,
          "selectedOptionId": 1
        }
      ],
      "score": 85.5,
      "totalPoints": 20,
      "earnedPoints": 17,
      "status": "SUBMITTED",
      "submittedAt": "2025-05-26T10:30:00.000Z",
      "gradedAt": null,
      "gradedBy": null,
      "feedback": null,
      "student": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "quiz": {
        "id": 1,
        "title": "JavaScript Basics Quiz",
        "lesson": {
          "id": 1,
          "title": "Introduction to JavaScript",
          "section": {
            "id": 1,
            "title": "Web Development Fundamentals",
            "course": {
              "id": 1,
              "title": "Full Stack Web Development",
              "instructorId": 2
            }
          }
        }
      }
    },
    {
      "id": 2,
      "submissionType": "assignment",
      "userId": 1,
      "assignmentId": 1,
      "fileUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/edunova/assignments/assignment_1_user_1_1234567890.pdf",
      "fileName": "assignment1.pdf",
      "fileType": "pdf",
      "fileSize": 1024000,
      "downloadUrl": "https://res.cloudinary.com/your-cloud/image/upload/fl_attachment/edunova/assignments/assignment_1_user_1_1234567890.pdf",
      "description": "My assignment submission",
      "isLate": false,
      "status": "SUBMITTED",
      "score": null,
      "maxScore": 100,
      "submittedAt": "2025-05-26T10:30:00.000Z",
      "gradedAt": null,
      "gradedBy": null,
      "feedback": null,
      "student": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignment": {
        "id": 1,
        "title": "JavaScript Project",
        "dueDate": "2025-05-30T23:59:59.000Z",
        "lesson": {
          "id": 1,
          "title": "Introduction to JavaScript",
          "section": {
            "id": 1,
            "title": "Web Development Fundamentals",
            "course": {
              "id": 1,
              "title": "Full Stack Web Development",
              "instructorId": 2
            }
          }
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  },
  "counts": {
    "quiz": 15,
    "assignment": 10,
    "total": 25
  }
}

```

----------

## Error Responses

### 401 Unauthorized

```json
{
  "message": "No token provided"
}

```

```json
{
  "message": "Invalid token"
}

```

```json
{
  "message": "Token revoked"
}

```

### 403 Forbidden

```json
{
  "message": "Instructor or admin access required"
}

```

### 404 Not Found

```json
{
  "message": "User not found"
}

```

### 500 Internal Server Error

```json
{
  "message": "Internal server error message"
}

```

----------

## Notes

1.  **Authentication**: Semua endpoint memerlukan JWT token yang valid dalam header Authorization.
    
2.  **Role-based Access**:
    
    -   Student dapat mengakses quiz dan submit assignment
    -   Instructor/Admin dapat melakukan grading dan melihat submissions
3.  **File Upload**:
    
    -   Maksimal ukuran file: 50MB
    -   Tipe file yang diizinkan: pdf, doc, docx, txt, jpg, jpeg, png, zip, rar
    -   Gunakan form-data untuk upload file
4.  **Pagination**: Semua endpoint list mendukung pagination dengan parameter `page` dan `limit`.
    
5.  **Filtering**: Endpoint list mendukung berbagai filter untuk memudahkan pencarian data.
    
6.  **Auto-grading**: Quiz akan otomatis dinilai saat submit berdasarkan jawaban yang benar.


---

# 8. Tag, User Instructor & Admin Instructor Management


## Base URL

```
http://localhost:3000
```

## Authentication


```
Authorization: Bearer <your_jwt_token>
```

----------

## 1. TAG ROUTES (`/api/tags`)

### 1.1 Get All Tags

**GET** `/api/tags`

**Headers:**

```
Content-Type: application/json

```

**Response:**

```json
[
  {
    "id": 1,
    "name": "JavaScript"
  },
  {
    "id": 2,
    "name": "React"
  }
]

```

### 1.2 Create New Tag

**POST** `/api/tags/create`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

```

**Body:**

```json
{
  "name": "Node.js"
}

```

**Success Response (201):**

```json
{
  "id": 3,
  "name": "Node.js"
}

```

**Error Response (400) - Tag already exists:**

```json
{
  "message": "Tag already exists"
}

```

**Error Response (400) - Missing name:**

```json
{
  "message": "Tag name is required"
}

```

----------

## 2. USER INSTRUCTOR ROUTES (`/api/users`)

### 2.1 Request to Become Instructor

**POST** `/api/users/request-instructor`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

```

**Body:**

```json
{
  "bio": "Experienced developer with 5+ years in web development",
  "expertise": ["JavaScript", "React", "Node.js"],
  "experience": "Senior Developer at Tech Company",
  "education": "Bachelor's in Computer Science",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe",
    "github": "https://github.com/johndoe"
  },
  "phoneNumber": "+1234567890",
  "profileImage": "https://cloudinary.com/profile.jpg"
}

```

**Success Response (200):**

```json
{
  "message": "Instructor request submitted successfully. Please wait for admin approval.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "instructorStatus": "PENDING"
  }
}

```

**Error Response (400) - Already instructor:**

```json
{
  "message": "You are already an instructor"
}

```

**Error Response (400) - Already pending:**

```json
{
  "message": "Your instructor request is already pending approval"
}

```

### 2.2 Update Instructor Profile

**PUT** `/api/users/{id}/instructor-profile`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

```

**Body:**

```json
{
  "bio": "Updated bio text",
  "expertise": ["JavaScript", "React", "Node.js", "Python"],
  "experience": "Updated experience",
  "education": "Updated education",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe-updated"
  },
  "phoneNumber": "+1234567891",
  "profileImage": "https://cloudinary.com/new-profile.jpg"
}

```

**Success Response (200):**

```json
{
  "message": "Instructor profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "INSTRUCTOR",
    "bio": "Updated bio text",
    "expertise": ["JavaScript", "React", "Node.js", "Python"],
    "experience": "Updated experience",
    "education": "Updated education",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe-updated"
    },
    "phoneNumber": "+1234567891",
    "profileImage": "https://cloudinary.com/new-profile.jpg",
    "instructorStatus": "APPROVED"
  }
}

```

### 2.3 Get Instructor Profile

**GET** `/api/users/{id}/instructor-profile`

**Headers:**

```
Content-Type: application/json

```

**Success Response (200):**

```json
{
  "message": "Instructor profile retrieved successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "INSTRUCTOR",
    "bio": "Experienced developer with 5+ years in web development",
    "expertise": ["JavaScript", "React", "Node.js"],
    "experience": "Senior Developer at Tech Company",
    "education": "Bachelor's in Computer Science",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "github": "https://github.com/johndoe"
    },
    "phoneNumber": "+1234567890",
    "profileImage": "https://cloudinary.com/profile.jpg",
    "instructorStatus": "APPROVED",
    "instructorRequestedAt": "2024-01-01T10:00:00.000Z",
    "instructorApprovedAt": "2024-01-02T10:00:00.000Z",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2024-01-02T10:00:00.000Z"
  }
}

```

### 2.4 Get All Instructors (Public)

**GET** `/api/users/instructors`

**Headers:**

```
Content-Type: application/json

```

**Query Parameters:**

-   `page` (optional): Page number (default: 1)
-   `limit` (optional): Items per page (default: 12)
-   `search` (optional): Search by name or bio
-   `expertise` (optional): Filter by expertise

**Example URL:**

```
/api/users/instructors?page=1&limit=10&search=javascript&expertise=React

```

**Success Response (200):**

```json
{
  "message": "Instructors retrieved successfully",
  "data": {
    "instructors": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "bio": "Experienced developer",
        "expertise": ["JavaScript", "React"],
        "experience": "5+ years",
        "education": "Computer Science",
        "socialLinks": {
          "linkedin": "https://linkedin.com/in/johndoe"
        },
        "profileImage": "https://cloudinary.com/profile.jpg",
        "instructorApprovedAt": "2024-01-02T10:00:00.000Z",
        "createdAt": "2023-12-01T10:00:00.000Z",
        "Courses": [
          {
            "id": 1,
            "title": "JavaScript Fundamentals",
            "status": "PUBLISHED",
            "price": 99.99,
            "thumbnail": "https://cloudinary.com/course-thumb.jpg"
          }
        ],
        "totalCourses": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}

```

### 2.5 Get Instructor Courses

**GET** `/api/users/instructors/{id}/courses`

**Headers:**

```
Content-Type: application/json

```

**Query Parameters:**

-   `page` (optional): Page number (default: 1)
-   `limit` (optional): Items per page (default: 10)
-   `status` (optional): Course status (default: PUBLISHED)

**Success Response (200):**

```json
{
  "message": "Instructor courses retrieved successfully",
  "data": {
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Experienced developer",
      "profileImage": "https://cloudinary.com/profile.jpg"
    },
    "courses": [
      {
        "id": 1,
        "title": "JavaScript Fundamentals",
        "description": "Learn JavaScript from scratch",
        "price": 99.99,
        "thumbnail": "https://cloudinary.com/course-thumb.jpg",
        "status": "PUBLISHED",
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z",
        "Sections": [
          {
            "id": 1,
            "title": "Introduction",
            "order": 1,
            "Lessons": [
              {
                "id": 1,
                "title": "Getting Started",
                "duration": 300
              }
            ]
          }
        ],
        "Enrollments": [
          {
            "id": 1,
            "status": "ENROLLED"
          }
        ],
        "totalLessons": 1,
        "totalDuration": 300,
        "totalEnrollments": 1
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}

```

### 2.6 Get Instructor Statistics (Admin Only)

**GET** `/api/users/instructors/{id}/stats`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>

```

**Query Parameters:**

-   `startDate` (optional): Start date for filtering (YYYY-MM-DD)
-   `endDate` (optional): End date for filtering (YYYY-MM-DD)

**Success Response (200):**

```json
{
  "message": "Instructor statistics retrieved successfully",
  "data": {
    "instructor": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Experienced developer",
      "profileImage": "https://cloudinary.com/profile.jpg",
      "instructorStatus": "APPROVED",
      "instructorApprovedAt": "2024-01-02T10:00:00.000Z",
      "createdAt": "2023-12-01T10:00:00.000Z"
    },
    "statistics": {
      "courses": {
        "total": 5,
        "published": 3,
        "draft": 2,
        "archived": 0
      },
      "enrollments": {
        "total": 150
      },
      "revenue": {
        "total": 4500.75
      },
      "trends": {
        "monthlyEnrollments": [
          {
            "month": "2024-01",
            "enrollments": 10
          },
          {
            "month": "2024-02",
            "enrollments": 15
          }
        ]
      }
    }
  }
}

```

----------

## 3. ADMIN INSTRUCTOR ROUTES (`/api/admin`)

### 3.1 Get Instructor Requests (Admin Only)

**GET** `/api/admin/instructor-requests`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>

```

**Query Parameters:**

-   `status` (optional): PENDING, APPROVED, REJECTED (default: PENDING)
-   `page` (optional): Page number (default: 1)
-   `limit` (optional): Items per page (default: 10)

**Success Response (200):**

```json
{
  "message": "Instructor requests retrieved successfully",
  "data": {
    "users": [
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "STUDENT",
        "bio": "Frontend developer with React expertise",
        "expertise": ["React", "CSS", "HTML"],
        "experience": "3 years",
        "education": "Web Development Bootcamp",
        "socialLinks": {
          "github": "https://github.com/janesmith"
        },
        "phoneNumber": "+1234567891",
        "profileImage": "https://cloudinary.com/jane-profile.jpg",
        "instructorStatus": "PENDING",
        "instructorRequestedAt": "2024-01-03T10:00:00.000Z",
        "createdAt": "2023-11-01T10:00:00.000Z",
        "updatedAt": "2024-01-03T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}

```

### 3.2 Approve/Reject Instructor Request (Admin Only)

**PUT** `/api/admin/instructor-requests/{id}/approve`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>

```

**Body for Approval:**

```json
{
  "action": "approve"
}

```

**Body for Rejection:**

```json
{
  "action": "reject",
  "rejectionReason": "Insufficient experience in the requested field"
}

```

**Success Response for Approval (200):**

```json
{
  "message": "Instructor request approved successfully",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "INSTRUCTOR",
    "instructorStatus": "APPROVED",
    "instructorApprovedAt": "2024-01-04T10:00:00.000Z"
  }
}

```

**Success Response for Rejection (200):**

```json
{
  "message": "Instructor request rejected successfully",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "STUDENT",
    "instructorStatus": "REJECTED",
    "rejectionReason": "Insufficient experience in the requested field"
  }
}

```

**Error Response (400) - Invalid action:**

```json
{
  "message": "Action must be either \"approve\" or \"reject\""
}

```

**Error Response (400) - No pending request:**

```json
{
  "message": "No pending instructor request found for this user"
}

```

----------

## Error Responses

### Authentication Errors

**401 Unauthorized - No token:**

```json
{
  "message": "No token provided"
}

```

**401 Unauthorized - Invalid token:**

```json
{
  "message": "Invalid token"
}

```

**401 Unauthorized - Token revoked:**

```json
{
  "message": "Token revoked"
}

```

### Authorization Errors

**403 Forbidden - Admin required:**

```json
{
  "message": "Admin access required"
}

```

**403 Forbidden - Instructor or Admin required:**

```json
{
  "message": "Instructor or admin access required"
}

```

**403 Forbidden - Profile access:**

```json
{
  "message": "You can only update your own profile"
}

```

### Resource Not Found

**404 Not Found:**

```json
{
  "message": "User not found"
}

```

**404 Not Found - Instructor profile:**

```json
{
  "message": "Instructor profile not found"
}

```

**404 Not Found - Instructor not approved:**

```json
{
  "message": "Instructor not found or not approved"
}

```

### Server Errors

**500 Internal Server Error:**

```json
{
  "message": "Database connection error"
}

```

----------

## Environment Variables Required

Pastikan file `.env` berisi:

```
DB_HOST=edunova-edunova.j.aivencloud.com
DB_PORT=14793
DB_NAME=defaultdb
DB_USER=avnadmin
DB_PASS=AVNS_4oVspjBNAW_qSSqMiY9
SSL_CA_PATH=./ca.pem
JWT_SECRET=b7f9c3e2d4a1f8b6c9e7d2a5b3c6f1e4d8a9b7c2e5f3a6d1c4b8e9f2a7d3c5
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=ddsmpjipq
CLOUDINARY_API_KEY=952333189161554
CLOUDINARY_API_SECRET=IPU4zr6dvywswnpOi05cv1cjIB0

```

----------

## Notes

-   Semua field dalam request body bersifat opsional kecuali yang secara eksplisit required

-   Format tanggal menggunakan ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

-   File upload menggunakan Cloudinary, jadi URL harus berupa Cloudinary URL

-   Pagination dimulai dari page 1

-   Default limit untuk pagination bervariasi per endpoint
