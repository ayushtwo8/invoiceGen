import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import invoiceRoutes from './routes/invoiceRoutes.js'
import clientRoutes from './routes/clientRoutes.js'

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// connect to mongoDB
connectDB();

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/clients', clientRoutes);

// health check
app.get("/api/health", (req, res) => {
    res.json({
        message: "Server is running"
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running");
});