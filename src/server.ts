import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from './models/User';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/angular_assessment';
const initializeMasterAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'Admin' });
    
    if (!adminExists) {
      console.log('No Admin found in database. Initializing default System Admin...');
      
      const defaultAdmin = new User({
        userId: 'admin_master',
        fullName: 'System Administrator',
        email: 'admin@aurasecure.com',
        password: 'admin_password',
        role: 'Admin'
      });
      
      await defaultAdmin.save();
      console.log('Master Admin initialized successfully.');
    }
  } catch (error) {
    console.error('Failed to initialize Master Admin:', error);
  }
};
mongoose.connect(MONGODB_URI).then(() => {
    console.log('Connected to MongoDb');
    initializeMasterAdmin();
})
.catch(err => console.error('Database connection failed: ', err));


const delayMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const delay = parseInt(req.query.delay as string) || 0;
    if(delay > 0){
        console.log(`Delaying response by ${delay}ms...`);
        setTimeout(() => next(), delay);
    }
    else{
        next();
    }
};

const authenticationToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        res.status(401).json({error: 'Access Denied: No Token Provided'});
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
            res.status(403).json({error: 'Invalid token'});
            return;
        }
        (req as any).user = decoded;
        next();
    });
};

app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
    const {userId, password} = req.body;
    const user = await User.findOne({userId});
    if(!user){
        res.status(401).json({error: 'Invalid Credentials'});
        return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user.userId, role: user.role }, JWT_SECRET, {expiresIn: '2h'});
    res.status(200).json({ token, role: user.role, userId: user.userId});
});


app.get('/api/records', authenticationToken, delayMiddleware, async (req: Request, res: Response) => {
    const currentUser = (req as any).user;
    const records = await User.find({ userId: currentUser.userId });
    res.status(200).json(records);
});

app.get('/api/users', authenticationToken, delayMiddleware, async (req: Request, res: Response): Promise<void> => {
    const currentUser = (req as any).user;
    if(currentUser.role !== 'Admin'){
        res.status(403).json({error: 'Required admin privileges'});
        return;
    }

    const allUsers = await User.find({}, '-password');
    res.status(200).json(allUsers);
});

app.post('/api/register', async(req, res) => {
    try{
        const { userId, password, role, fullName, email } = req.body;

        if(!userId || !password){
            return res.status(400).json({ message: 'UserId and Password are required.'});
        }
        
        const assignedRole = (role === 'Admin')? 'General User' : (role || 'General User');

        const existingUser = await User.findOne({userId});
        if(existingUser) {
            return res.status(409).json({ message: 'This User ID is already taken.' });
        }

        const newUser = new User({
            userId,
            password,
            role: assignedRole,
            fullName,
            email
        });

        await newUser.save();
        res.status(201).json({message: 'Registration successful. You can now log in.'});
    }
    catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

app.listen(PORT, () => {
    console.log(`Server executing on port ${PORT}`);
});