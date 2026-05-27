import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/User";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/27017/angular_assessment';

const seedDatabase = async() => {
    try{
        await mongoose.connect(MONGODB_URI);
        console.log('Connected for database for seeding...');


        await User.deleteMany({});
        console.log('Cleared existing data.' );

        const users = await User.insertMany([
            { 
                userId: 'admin01', 
                fullName: 'System Administrator',
                email: 'admin@aurasecure.com',
                password: 'password123',
                role: 'Admin' 
            },
            { 
                userId: 'user01', 
                fullName: 'Jane Doe',
                email: 'jane.doe@company.com',
                password: 'password123', 
                role: 'General User' 
            },
            { 
                userId: 'user02', 
                fullName: 'John Smith',
                email: 'john.smith@company.com',
                password: 'password123', 
                role: 'General User' 
            }
        ]);
        console.log('Inserted dummy users');
        await mongoose.disconnect();
        console.log('Seeding Complete. Disconnect.');
        process.exit(0);
    }catch(error){
        console.error('Seeding failed: ', error);
        process.exit(1);
    }
};

seedDatabase();