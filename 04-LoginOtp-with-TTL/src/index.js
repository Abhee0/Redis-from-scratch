import express from 'express';
import Redis from 'ioredis';


const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function optKey(phone) {
    return `otp:${phone}`;
}

app.post('/otp', async (req, res) => {
    const { phone } = req.body; 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(optKey(phone), otp, 'EX', 60); // OTP valid for 60 seconds
    res.json({ message: 'OTP sent successfully', otp }); // In real app, don't send OTP in response
});

app.post('/opt/verify', async (req, res) => {

    const { phone, otp } = req.body;
    const savedOtp = await redis.get(optKey(phone));

    if (!savedOtp) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    if (savedOtp !== otp) {
        return res.status(400).json({ error: 'Incorrect OTP' });
    }

    await redis.del(optKey(phone)); // Remove the OTP after successful verification
    res.json({ message: 'OTP verified successfully' });
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(optKey(req.params.phone )); // Get TTL of the OTP key   
    res.json({ ttl });
});


app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});