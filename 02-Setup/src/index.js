import exprees from 'express';
import cors from 'cors';
import Redis from 'ioredis';
import mongoose from 'mongoose';

const app = exprees();



const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/redis', async (req, res) => {
    const reply = await redis.ping();
    res.json({ redis: reply });
 });


app.get('/mongo', async (req, res) => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/redis_from_scratch';

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri)

    }
    res.json({ mongo: 'connected',database: mongoose.connection.name });
})    


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});