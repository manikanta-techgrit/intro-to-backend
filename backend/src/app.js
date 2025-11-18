import express from 'express';


const app = express();

// Importing user routes
import userRoutes from './routes/user.route.js';

// routes declaration
app.use(express.json());
app.use('/api/v1/users', userRoutes);

//example route :http://localhost:5000/api/v1/users/register

export default app;