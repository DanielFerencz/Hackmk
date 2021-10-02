import path from 'path';
import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as database from './db/freeCollabDB.js';
import requestRoutes from './routes/views.js';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';
import invitationRoutes from './routes/invitation.js';
import { decodeJWTToken } from './public/middlewares.js';

// app letrehozasa, statikus folder keszitese
const app = express();
const uploadDir = path.join(process.cwd(), 'uploadDir');

if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
}

// johet keres a localhost:3000-tol
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.static(uploadDir));
app.use('/uploadPhoto', eformidable({ uploadDir }));
app.use('/api', express.json());
database.default();

app.use(decodeJWTToken);

// Routerek bekotese
app.use(requestRoutes);
app.use('/api', apiRoutes);
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', invitationRoutes);

app.listen(8080, () => {
    console.log('Server listening on http://localhost:8080/');
});
