// 

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import connectCloudinary from './configs/cloudinary.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------
// CORS Setup
// ----------------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://learning-management-system-frontend-psi-six.vercel.app',
  'learning-management-system-frontend-n9ki9nswy.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.options('*', cors());

// ----------------------
// Middlewares
// ----------------------
app.use(express.json());
app.use(clerkMiddleware()); // ✅ correct usage, no URL here

// ----------------------
// Test Route
// ----------------------
app.get('/*', (req, res) => res.send('API working'));

// ----------------------
// Routers
// ----------------------
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

// ----------------------
// Webhooks
// ----------------------
app.post('/clerk', clerkWebhooks); // keep lowercase
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ----------------------
// Start Server
// ----------------------
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();
