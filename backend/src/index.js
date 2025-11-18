import dotenv from 'dotenv'; 
import connectDatabase from './config/database.js';
import app from './app.js';

dotenv.config({
    path: './.env'
});

const startServer =async () => {
    try {
        await connectDatabase();
        app.on('error', (error) => {
            console.error('Server error:', error);   
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
    console.log('Server started successfully');
}

startServer();