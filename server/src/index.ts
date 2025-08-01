import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './routes/media.routes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/media', mediaRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
