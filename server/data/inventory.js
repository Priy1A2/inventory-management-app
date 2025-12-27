// server/data/inventory.js
let products = [
    // ... (Existing products: P001, P005, P006 - Clothes) ...

    // { product_id: 'P001', product_code: 'CLO-101', name: 'Slim Fit Jeans Mens(32)', unit_price: 1999, description: 'Premium Denim, Size 32', location: 'Aisle 1', category: 'Clothes', reorder_point: 10, target_stock: 50, image_url: 'https://picsum.photos/seed/p001/150/100' },
    { product_id: 'P001', product_code: 'CLO-101', name: 'Womens Red dress', unit_price: 3999, description: 'Premium Denim, Size 32', location: 'Aisle 1', category: 'Clothes', reorder_point: 10, target_stock: 50, image_url: 'https://images.pexels.com/photos/7909580/pexels-photo-7909580.jpeg' },
    { product_id: 'P005', product_code: 'CLO-102', name: 'Winter Jacket', unit_price: 1899, description: 'Floral print, Medium', location: 'Aisle 2', category: 'Clothes', reorder_point: 5, target_stock: 30, image_url: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg' },
    { product_id: 'P006', product_code: 'CLO-103', name: 'Women’s Casual Outfit', unit_price: 1500, description: 'Winter wear, Extra Large', location: 'Aisle 1', category: 'Clothes', reorder_point: 8, target_stock: 40, image_url: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg' },
    
    // ... (Existing products: P002, P007 - Grocery) ...
    { product_id: 'P002', product_code: 'GRO-205', name: 'Fresh Vegetables', unit_price: 65, description: 'Dairy product', location: 'Fridge 1', category: 'Grocery', reorder_point: 50, target_stock: 200, image_url: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/vegetables-1238250_1280.jpg' },
    { product_id: 'P007', product_code: 'GRO-206', name: 'Milk Bottle', unit_price: 150, description: 'Free-range brown eggs', location: 'Fridge 2', category: 'Grocery', reorder_point: 20, target_stock: 80, image_url: 'https://cdn.pixabay.com/photo/2016/11/23/14/45/milk-1852067_1280.jpg' },

    // ... (Existing products: P003, P008 - Stationery) ...
    { product_id: 'P003', product_code: 'STA-331', name: 'Pack of Pencils (HB)', unit_price: 120, description: 'HB lead', location: 'Aisle 5', category: 'Stationery', reorder_point: 100, target_stock: 400, image_url: 'https://images.pexels.com/photos/1918296/pexels-photo-1918296.jpeg' },
    { product_id: 'P008', product_code: 'STA-332', name: 'A4 Notebook and pens (200pg)', unit_price: 80, description: 'Spiral bound', location: 'Aisle 5', category: 'Stationery', reorder_point: 50, target_stock: 150, image_url: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg' },

    // ... (Existing product: P004 - Food) ...
    { product_id: 'P004', product_code: 'FOD-404', name: 'Fast Food Burger', unit_price: 99, description: 'High protein snack', location: 'Counter', category: 'Food', reorder_point: 20, target_stock: 100, image_url: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg' },
    { product_id: 'P004', product_code: 'FOD-404', name: 'Pasta', unit_price: 99, description: 'High protein snack', location: 'Counter', category: 'Food', reorder_point: 20, target_stock: 100, image_url: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg' },
    
    // --- NEW PRODUCTS ---
    
    // Makeup Category
    { product_id: 'P009', product_code: 'MKP-501', name: 'Red Matte Lipstick', unit_price: 650, description: 'Long-lasting matte finish', location: 'Cosmetics 1', category: 'Makeup', reorder_point: 15, target_stock: 60, image_url: 'https://images.pexels.com/photos/4386591/pexels-photo-4386591.jpeg' },
    { product_id: 'P010', product_code: 'MKP-502', name: 'Cosmetic Products Flat Lay', unit_price: 1200, description: 'SPF 30, Light shade', location: 'Cosmetics 2', category: 'Makeup', reorder_point: 10, target_stock: 40, image_url: 'https://images.pexels.com/photos/6626762/pexels-photo-6626762.jpeg' },
    
    // Shoes Category
    { product_id: 'P011', product_code: 'SHO-601', name: 'Running Sneakers (42)', unit_price: 3500, description: 'Breathable fabric, Size 42', location: 'Footwear 1', category: 'Shoes', reorder_point: 5, target_stock: 25, image_url: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg' },
    { product_id: 'P012', product_code: 'SHO-602', name: 'Leather Boots (40)', unit_price: 4999, description: 'Genuine leather, Size 40', location: 'Footwear 2', category: 'Shoes', reorder_point: 3, target_stock: 15, image_url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg' },

];

let stock = {
    // ... (Existing stock entries P001-P008) ...
    'P001': 45, 'P005': 28, 'P006': 5, // Clothes
    'P002': 5, 'P007': 15,            // Grocery
    'P003': 300, 'P008': 140,         // Stationery
    'P004': 0,                        // Food
    
    // NEW Stock entries
    'P009': 55,  // Lipstick
    'P010': 35,  // Foundation
    'P011': 20,  // Sneakers
    'P012': 10,  // Boots
};

module.exports = { products, stock };