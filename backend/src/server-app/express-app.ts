import express from 'express';
import morgan from 'morgan'
import iaRoutes from "./routes/ia-api.js";
import authRoutes from './routes/auth-api.js'
import customerRoutes from './routes/customer-api.js'
import SalesRoutes from './routes/sales-api.js'
import cors from 'cors'
import type { Request, Response, NextFunction } from "express";
import { corsConfig } from './config/cors.js';

const app = express();

//middleware
app.use(express.json());
app.use(morgan('combined'))

app.use(cors(corsConfig))

//routes
app.use('/api/ia', iaRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/admin', customerRoutes)
app.use('/api/admin', SalesRoutes);




// 404 Handler - catch requests to unknown routes
app.use((req: Request, res: Response) => {
  if (req.path.startsWith("/api/")) {
    // API routes return JSON
    res.status(404).json({
      error: "Not Found",
      message: `API endpoint ${req.path} not found`,
    });
  } else {
    // Other routes render error page or return HTML
    res.status(404).render("errors/404");
  }
});

export default app
