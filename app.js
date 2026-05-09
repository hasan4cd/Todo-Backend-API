import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todo.routes.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
connectDB();

// Routes
app.use('/api/todos', todoRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;