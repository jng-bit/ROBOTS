import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();
        
        console.log('--- Database Stats ---');
        console.log(`Users: ${userCount}`);
        console.log(`Products: ${productCount}`);
        console.log(`Categories: ${categoryCount}`);
        
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkData();
