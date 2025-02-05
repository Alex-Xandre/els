import express, { Express, Request } from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import conn from './config/dbConnection';
import userRoute from './routes/user-route';
import courseRoute from './routes/course-route';
import { socketHandler } from './middlewares/socket-handler';
import uploadRoute from './routes/upload.routes';
import assessmentRoute from './routes/assessment-route';

dotenv.config();

const app: Express = express();
const port = 5000;

const server = createServer(app);

const corsOptions = {
  origin: ['http://localhost:5173'],
};

const io = new Server(server, {
  cors: {
    origin: corsOptions.origin,
  },
});

app.use((req, res, next) => {
  (req as Request & { io: Server }).io = io;
  next();
});

// Middleware
app.use(
  cors({
    origin: corsOptions.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '5000mb', extended: true }));

// Routes
app.use('/api/auth', userRoute);
app.use('/api/courses', courseRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/assessment', assessmentRoute);
// Static files
app.use('/uploads', express.static('uploads'));

// Database connection and server startup
conn()
  .then(() => {
    socketHandler(io);
    server.listen(port, () => {
      console.log(`Express is listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err);
  });

export { io };
