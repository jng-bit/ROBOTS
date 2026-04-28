import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import NodeCache from 'node-cache';

// Cache for 5 minutes (300 seconds)
const cache = new NodeCache({ stdTTL: 300 });

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    // Check if products are in cache
    const cachedProducts = cache.get('allProducts');
    if (cachedProducts) {
        return res.json(cachedProducts);
    }

    const products = await Product.find({}).populate('category', 'name');
    
    // Set to cache
    cache.set('allProducts', products);
    
    res.json(products);
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
    // Handle uploaded images from Cloudinary
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const {
        name,
        description,
        price,
        originalPrice,
        category,
        specs,
        stock,
        featured,
        warranty,
        deliveryInfo,
        colors
    } = req.body;

    const product = new Product({
        name,
        description,
        price,
        originalPrice,
        images: imageUrls.length > 0 ? imageUrls : [],
        category,
        specs: typeof specs === 'string' ? JSON.parse(specs) : specs,
        stock,
        featured: featured === 'true' || featured === true,
        warranty,
        deliveryInfo,
        colors: typeof colors === 'string' ? JSON.parse(colors) : colors
    });

    const createdProduct = await product.save();
    
    // Invalidate cache when a new product is created
    cache.del('allProducts');
    
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        originalPrice,
        images,
        category,
        specs,
        stock,
        featured,
        warranty,
        deliveryInfo,
        colors
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        // Handle uploaded images from Cloudinary
        if (req.files && req.files.length > 0) {
            const newImageUrls = req.files.map(file => file.path);
            product.images = newImageUrls;
        } else if (images) {
            product.images = Array.isArray(images) ? images : [images];
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.originalPrice = originalPrice || product.originalPrice;
        product.category = category || product.category;
        product.specs = typeof specs === 'string' ? JSON.parse(specs) : (specs || product.specs);
        product.stock = stock || product.stock;
        product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
        product.warranty = warranty || product.warranty;
        product.deliveryInfo = deliveryInfo || product.deliveryInfo;
        product.colors = typeof colors === 'string' ? JSON.parse(colors) : (colors || product.colors);

        const updatedProduct = await product.save();
        
        // Invalidate cache when a product is updated
        cache.del('allProducts');
        
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        
        // Invalidate cache when a product is deleted
        cache.del('allProducts');
        
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

