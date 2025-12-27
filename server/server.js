// server/server.js
const express = require('express');
const path = require('path');

// Load initial product + stock data
let { products, stock } = require('./data/inventory');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// =======================================================
// Helper: Merge product data + stock
// =======================================================
const getProductsWithStock = () => {
    return products.map(product => {
        const currentStock = stock[product.product_id] || 0;
        return { ...product, current_stock: currentStock };
    });
};

// =======================================================
// CORE API ROUTES
// =======================================================

// Get all products
app.get('/api/products', (req, res) => {
    res.json(getProductsWithStock());
});

// Get products by category
app.get('/api/products/:category', (req, res) => {
    const categoryName = req.params.category.toLowerCase();
    const filtered = getProductsWithStock().filter(
        p => p.category.toLowerCase() === categoryName
    );
    res.json(filtered);
});

// Sale → Reduce stock
app.post('/api/sale', (req, res) => {
    const items = req.body.items;

    items.forEach(item => {
        if (stock[item.id] !== undefined) {
            stock[item.id] -= Number(item.qty);
            if (stock[item.id] < 0) stock[item.id] = 0;
        }
    });

    res.json({
        message: "Sale processed, stock updated.",
        bill_id: `BILL-${Date.now()}`
    });
});

// Reorder List
app.get('/api/reorder-list', (req, res) => {
    const list = getProductsWithStock()
        .filter(p => p.current_stock < p.reorder_point)
        .map(p => ({
            ...p,
            needed_quantity: p.target_stock - p.current_stock
        }));

    res.json(list);
});

// =======================================================
// ADMIN CRUD & STOCK MOVEMENTS
// =======================================================

// ADD PRODUCT
app.post('/api/admin/product', (req, res) => {
    const newProduct = req.body;
    const newId = 'P' + (products.length + 100);

    if (!newProduct.name || !newProduct.unit_price) {
        return res.status(400).json({ message: "Name and Price are required." });
    }

    const complete = {
        product_id: newId,
        product_code: 'NEW-00' + (products.length + 1),
        ...newProduct,
        location: newProduct.location || 'Unknown',
        category: newProduct.category || 'Miscellaneous',
        reorder_point: newProduct.reorder_point || 10,
        target_stock: newProduct.target_stock || 50,
        image_url: newProduct.image_url || 'https://picsum.photos/seed/newitem/150/100'
    };

    products.push(complete);
    stock[newId] = newProduct.initial_stock || 0;

    res.status(201).json({ message: "Product added.", product: complete });
});

// DELETE PRODUCT  ✅ FULLY FIXED
app.delete('/api/admin/product/:id', (req, res) => {
    const productId = req.params.id;

    // Remove from product list
    products = products.filter(p => p.product_id !== productId);

    // Remove corresponding stock
    delete stock[productId];

    res.json({ success: true, message: "Product deleted successfully." });
});

// STOCK IN  (Increase stock)
app.post('/api/admin/stock-in', (req, res) => {
    const { productId, quantity } = req.body;

    if (!stock[productId]) stock[productId] = 0;  // If missing
    stock[productId] += Number(quantity);

    res.json({ message: "Stock added successfully." });
});

// STOCK OUT (Decrease stock)
app.post('/api/admin/stock-out-manual', (req, res) => {
    const { productId, quantity } = req.body;

    if (!stock[productId]) stock[productId] = 0;
    stock[productId] -= Number(quantity);

    if (stock[productId] < 0) stock[productId] = 0;

    res.json({ message: "Stock reduced successfully." });
});

// =======================================================
// START SERVER
// =======================================================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Frontend URL: http://localhost:${PORT}/index.html`);
});







// // server/server.js
// const express = require('express');
// const path = require('path');
// // Use require() to load the data initially
// let { products, stock } = require('./data/inventory'); 

// const app = express();
// const PORT = 3000;

// // 1. Core Middleware (JSON Parsing and Static Files)
// app.use(express.json()); 
// app.use(express.static(path.join(__dirname, '..', 'public')));

// // Helper function to merge product details with current stock quantity
// const getProductsWithStock = () => {
//     return products.map(product => {
//         const currentStock = stock[product.product_id] || 0;
//         return { ...product, current_stock: currentStock };
//     });
// }

// // =======================================================
// // CORE API ROUTES
// // =======================================================

// // 1. Get all products (Used for front page Quick-Pick and Admin Products List)
// app.get('/api/products', (req, res) => {
//     res.json(getProductsWithStock());
// });

// // 1b. Get products by category 
// app.get('/api/products/:category', (req, res) => {
//     const categoryName = req.params.category;
//     const filteredProducts = getProductsWithStock().filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
//     res.json(filteredProducts);
// });

// // 2. Mock endpoint for processing a sale (Stock Movement OUT)
// app.post('/api/sale', (req, res) => {
//     const saleData = req.body.items;
//     console.log(`Processing sale for:`, saleData);
//     [cite_start]// In a real system, this updates stock automatically [cite: 5, 31]
//     res.status(200).json({ 
//         message: 'Sale processed successfully. Stock updated automatically.', 
//         bill_id: `BILL-${Date.now()}` 
//     });
// });

// // 3. Mock endpoint for the "What to Order" list (Reorder Report)
// app.get('/api/reorder-list', (req, res) => {
//     const productsWithStock = getProductsWithStock();
//     const reorderList = productsWithStock
//         .filter(p => p.current_stock < p.reorder_point)
//         .map(p => ({
//             ...p,
//             needed_quantity: p.target_stock - p.current_stock
//         }));
//     res.json(reorderList);
// });

// // =======================================================
// // ADMIN CRUD & MOVEMENT ROUTES
// // =======================================================

// // 4. Mock endpoint to add a new product 
// app.post('/api/admin/product', (req, res) => {
//     const newProduct = req.body;
//     const newId = 'P' + (products.length + 100);
    
//     if (!newProduct.name || !newProduct.unit_price) {
//         return res.status(400).json({ message: "Name and Price are required." });
//     }

//     const completeNewProduct = {
//         product_id: newId,
//         product_code: 'NEW-00' + (products.length + 1),
//         ...newProduct,
//         location: newProduct.location || 'Unknown',
//         category: newProduct.category || 'Miscellaneous',
//         reorder_point: newProduct.reorder_point || 10,
//         target_stock: newProduct.target_stock || 50,
//         image_url: newProduct.image_url || 'https://picsum.photos/seed/newitem/150/100'
//     };

//     products.push(completeNewProduct); // Update mock data store
//     stock[newId] = newProduct.initial_stock || 0; // Set initial stock

//     console.log(`New product added: ${completeNewProduct.name}`);
//     res.status(201).json({ message: 'Product added successfully.', product: completeNewProduct });
// });

// // 5. Mock endpoint to delete a product
// app.delete('/api/admin/product/:id', (req, res) => {
//     const id = parseInt(req.params.id);

//     // Remove product from list
//     staticProducts = staticProducts.filter(p => p.id !== id);

//     // Remove stock from stock object
//     delete staticStockLevels[id];

//     res.json({ success: true });
// });



// // 6. Mock endpoint to record Incoming Stock (IN Movement)
// app.post('/api/admin/stock-in', (req, res) => {
//     const data = req.body;
//     // In a real system, this updates stock/batches/audit trail
//     console.log('Recorded IN Movement:', data);
//     res.status(200).json({ message: 'Incoming stock recorded successfully.' });
// });

// // 7. Mock endpoint to record Wastage/Consumption (OUT Movement)
// app.post('/api/admin/stock-out-manual', (req, res) => {
//     const data = req.body;
//     // In a real system, this updates stock/batches/audit trail
//     console.log('Recorded OUT Movement (Wastage):', data);
//     res.status(200).json({ message: 'Stock wastage/consumption recorded successfully.' });
// });


// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//     console.log(`Frontend URL: http://localhost:${PORT}/index.html`);
// });