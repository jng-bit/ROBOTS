import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const updateRoles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await User.updateMany({}, { role: 'admin' });
        console.log(`Updated ${result.modifiedCount} users to admin role.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateRoles();
