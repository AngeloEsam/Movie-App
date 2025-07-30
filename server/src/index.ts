import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './routes/media.routes';
import errorHandler from './middleware/errorHandler';
import createServerlessExpress from '@vendia/serverless-express';
dotenv.config();

const app = express();
app.use(cors({
    origin: '*',
}
));
app.use(express.json());

app.use('/api/media', mediaRoutes);
app.use(errorHandler);

export default createServerlessExpress({ app });
