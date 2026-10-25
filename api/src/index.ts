import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import popiaRoutes from './routes/popia';
import vulaRoutes from './routes/vula';
import opportunityRoutes from './routes/opportunities';
import assessmentRoutes from './routes/assessments';
import vouchRoutes from './routes/vouch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/popia', popiaRoutes);
app.use('/api/vula', vulaRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/vouch', vouchRoutes);

app.listen(port, () => {
  console.log(`Vulindlela API running on port ${port}`);
});
