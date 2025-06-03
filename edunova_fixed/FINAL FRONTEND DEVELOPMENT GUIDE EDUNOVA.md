# **FINAL FRONTEND DEVELOPMENT GUIDE - EDUNOVA**

## **SECTION A: PUBLIC FEATURES (Role: USER/STUDENT)**

### **Phase A1: Authentication & Registration**

1.  `POST /api/auth/register` - Halaman registrasi
2.  `POST /api/auth/login` - Halaman login
3.  `GET /api/auth/me` - Profile user (setelah login)
4.  `POST /api/auth/logout` - Fungsi logout
5.  `PUT /api/auth/change-password` - Ubah password

### **Phase A2: Course Discovery (Public Access)**

6.  `GET /api/categories` - Tampilkan kategori di homepage
7.  `GET /api/tags` - Tampilkan tags untuk filter
8.  `GET /api/courses` - Homepage dengan daftar kursus + filtering
9.  `GET /api/courses/:id` - Halaman detail kursus
10.  `GET /api/courses/:id/sections` - Lihat struktur section dan lesson
11.  `GET /api/lessons/:lessonId/preview` - Preview video gratis (lesson pertama)
12.  `GET /api/users/:id/instructor-profile` - Profile instructor (public)
13.  `GET /api/users/instructors` - Directory semua instructor
14.  `GET /api/users/instructors/:id/courses` - Kursus dari instructor tertentu

### **Phase A3: Enrollment & Payment**

15.  `POST /api/courses/:courseId/enroll` - Proses enrollment
16.  `PUT /api/enrollments/:enrollmentId/payment` - Proses pembayaran

### **Phase A4: Student Dashboard**

17.  `GET /api/my-enrollments` - Dashboard kursus yang diikuti
18.  `GET /api/enrollments/:id` - Detail enrollment & progress
19.  `GET /api/enrollments/:id/next-lesson` - Lesson berikutnya
20.  `GET /api/student/submissions` - Riwayat semua submission

### **Phase A5: Learning Experience**

21.  `GET /api/lessons/:id` - Halaman belajar (lesson detail)
22.  `GET /api/lessons/:lessonId/stream` - Video streaming (enrolled students)
23.  `GET /api/lessons/:lessonId/video-info` - Info video metadata
24.  `PUT /api/courses/:courseId/progress` - Update progress belajar

### **Phase A6: Quiz & Assignment System (Student)**

25.  `GET /api/lessons/:lessonId/quiz` - Ambil quiz untuk lesson
26.  `GET /api/quizzes/:id/take` - Halaman mengerjakan quiz
27.  `POST /api/quizzes/:id/submit` - Submit jawaban quiz
28.  `GET /api/quizzes/:id/results` - Hasil quiz setelah submit
29.  `GET /api/lessons/:lessonId/assignment` - Ambil assignment untuk lesson
30.  `POST /api/assignments/:id/submit` - Submit assignment dengan file
31.  `GET /api/submissions/:id` - Detail submission tertentu

### **Phase A7: Instructor Request**

32.  `POST /api/users/request-instructor` - Request jadi instructor

----------

## **SECTION B: INSTRUCTOR FEATURES (Role: INSTRUCTOR)**

### **Phase B1: Instructor Dashboard Overview**

33.  `GET /api/auth/me` - Data profil instructor
34.  `GET /api/users/:id/instructor-profile` - Profile instructor lengkap
35.  `PUT /api/users/:id/instructor-profile` - Update profile instructor
36.  `GET /api/users/instructors/:id/courses` - Overview semua kursus

### **Phase B2: Course Management**

37.  `POST /api/courses/create` - Buat kursus baru
38.  `GET /api/courses` - Filter kursus milik sendiri
39.  `GET /api/courses/:id` - Detail kursus
40.  `PUT /api/courses/:id` - Edit kursus
41.  `DELETE /api/courses/:id` - Hapus kursus
42.  `PUT /api/courses/:id/status` - Publish/unpublish kursus

### **Phase B3: Content Structure Management**

43.  `GET /api/courses/:id/sections` - Struktur section kursus
44.  `POST /api/courses/:id/sections/create` - Tambah section baru
45.  `PUT /api/sections/:id` - Edit section
46.  `DELETE /api/sections/:id` - Hapus section
47.  `PUT /api/courses/:id/sections/reorder` - Reorder sections

### **Phase B4: Lesson Management**

48.  `GET /api/sections/:id/lessons` - Lessons dalam section
49.  `POST /api/sections/:id/lessons` - Upload lesson dengan video
50.  `GET /api/lessons/:id` - Detail lesson
51.  `PUT /api/lessons/:id` - Edit lesson
52.  `DELETE /api/lessons/:id` - Hapus lesson
53.  `PUT /api/sections/:id/lessons/reorder` - Reorder lessons

### **Phase B5: Course Categorization**

54.  `GET /api/categories` - Daftar kategori tersedia
55.  `GET /api/tags` - Daftar tags tersedia
56.  `POST /api/courses/:id/categories` - Assign kategori ke kursus
57.  `POST /api/courses/:id/tags` - Assign tags ke kursus
58.  `POST /api/tags/create` - Buat tag baru

### **Phase B6: Quiz & Assignment Creation**

59.  `POST /api/lessons/:id/quiz` - Buat quiz untuk lesson
60.  `GET /api/quizzes/:id` - Detail quiz
61.  `PUT /api/quizzes/:id` - Edit quiz
62.  `POST /api/quizzes/:id/questions` - Tambah pertanyaan single
63.  `POST /api/quizzes/:id/questions/bulk` - Tambah pertanyaan bulk
64.  `PUT /api/questions/:id` - Edit pertanyaan
65.  `POST /api/questions/:id/options/bulk` - Tambah opsi jawaban
66.  `POST /api/quizzes/:id/options/bulk` - Tambah opsi untuk multiple questions

### **Phase B7: Assignment Management**

67.  `POST /api/lessons/:id/assignment` - Buat assignment untuk lesson
68.  `GET /api/assignments/:id` - Detail assignment
69.  `PUT /api/assignments/:id` - Edit assignment
70.  `GET /api/courses/:courseId/assignments` - Semua assignment dalam kursus
71.  `GET /api/assignments` - Semua assignment milik instructor

### **Phase B8: Student Management & Grading**

72.  `GET /api/instructor/submissions` - Semua submission untuk grading
73.  `GET /api/submissions/:id` - Detail submission student
74.  `PUT /api/submissions/:id/grade` - Beri nilai submission
75.  `GET /api/courses/:courseId/quizzes` - Semua quiz dalam kursus
76.  `GET /api/quizzes` - Semua quiz milik instructor

### **Phase B9: Analytics & Performance**

77.  `GET /api/courses/:id/analytics` - Analytics kursus
78.  `GET /api/courses/:id/analytics/enrollments` - Trend enrollment
79.  `GET /api/courses/:id/analytics/revenue` - Revenue analytics

### **Phase B10: Financial Management**

80.  `GET /api/payouts/instructor/total-balance` - Total balance
81.  `GET /api/payouts/course/:courseId/balance` - Balance per kursus
82.  `GET /api/payouts/instructor/my-payouts` - Riwayat payout
83.  `POST /api/payouts` - Request payout baru
84.  `GET /api/payouts/:id` - Detail payout
85.  `GET /api/payouts/debug/instructor-info` - Debug info (development)

----------

## **SECTION C: ADMIN FEATURES (Role: ADMIN)**

### **Phase C1: Admin Dashboard Overview**

86.  `GET /api/admin/dashboard` - Dashboard admin utama
87.  `GET /api/admin/users` - Kelola semua user dengan filtering
88.  `GET /api/admin/courses` - Kelola semua kursus dengan statistics

### **Phase C2: Instructor Management**

89.  `GET /api/admin/instructor-requests` - Daftar request instructor (jeda Disini)
90.  `PUT /api/admin/users/:id/approve-instructor` - Approve/reject instructor
91.  `GET /api/users/instructors/:id/stats` - Statistics instructor

### **Phase C3: Content Management**

92.  `POST /api/categories/create` - Buat kategori baru
93.  `PUT /api/categories/update/:id` - Update kategori
94.  `POST /api/tags/create` - Buat tag baru (admin access)

### **Phase C4: Financial Management**

95.  `GET /api/admin/payouts/pending` - Semua payout pending
96.  `PUT /api/payouts/:id/status` - Update status payout
97.  `GET /api/payouts/:id` - Detail payout untuk review

### **Phase C5: System Management**

98.  `GET /api/users/:userId/enrollments` - Enrollment user tertentu
99.  Access to all instructor endpoints for system management

----------

## **IMPLEMENTATION PRIORITY ROADMAP**

### **Sprint 1: Core Public Features (Week 1-2)**

-   Phase A1-A3: Authentication → Course Discovery → Enrollment

### **Sprint 2: Learning Experience (Week 3-4)**

-   Phase A4-A6: Student Dashboard → Learning → Quiz/Assignment

### **Sprint 3: Instructor Basics (Week 5-6)**

-   Phase B1-B4: Instructor Dashboard → Course & Content Management

### **Sprint 4: Advanced Instructor Features (Week 7-8)**

-   Phase B5-B8: Categorization → Quiz/Assignment Creation → Grading

### **Sprint 5: Analytics & Finance (Week 9-10)**

-   Phase B9-B10: Analytics → Financial Management

### **Sprint 6: Admin Panel (Week 11-12)**

-   Phase C1-C5: Complete Admin Dashboard

### **Sprint 7: Polish & Testing (Week 13-14)**

-   Phase A7: Instructor Request Integration
-   Cross-role testing and refinement

**Total Development Time: ~14 weeks untuk full implementation**
