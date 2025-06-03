require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoute = require('./routes/auth');
const categoryRoute = require('./routes/category');
const tagRoute = require('./routes/tag');
const userRoute = require('./routes/userInstructor')
const adminRoute = require('./routes/adminInstructor');
const courseRoute = require('./routes/course');
const sectionRoute = require('./routes/section');
const enrollmentRoute = require('./routes/enrollment');
const quizAssignmentRoute = require('./routes/quizAssignment');
const adminDashboardRoute = require('./routes/adminDashboard');
const payoutRoute = require('./routes/payout');
const adminPayoutRoute = require('./routes/adminPayout');
const submissionRoute = require('./routes/submission');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/tags', tagRoute);
app.use('/api/users', userRoute); 
app.use('/api/admin', adminRoute); 
app.use('/api/courses', courseRoute);
app.use('/api', sectionRoute);
app.use('/api', enrollmentRoute);
app.use('/api', quizAssignmentRoute);
app.use('/api/admin', adminDashboardRoute);
app.use('/api/payouts', payoutRoute);
app.use('/api/admin', adminPayoutRoute);
app.use('/api', submissionRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));