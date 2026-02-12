const Product = require("../models/Product");

// @desc Get all products
// @route GET /api/v1/products
// @access Private

const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        }); 
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// @desc Get single product
// @route GET /api/v1/products/:id
// @access Private

const getProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.status(200).json({
            success: true,
            data: product
        }); 
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// @desc Create new product
// @route POST /api/v1/products
// @access Private
// @route GET /api/v1/products/:id
// @access Private

const createProduct = async (req, res) => {
    try{
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        }); 
    }catch(error){
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}


// @desc Update a product
// @route PUT /api/v1/products/:id
// @access Private

const updateProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true});

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        }); 
    }catch(error){
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
}

// @desc Delete a product
// @route DELETE /api/v1/products/:id
// @access Private

const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: "Product deleted successfully"
        }); 
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};


