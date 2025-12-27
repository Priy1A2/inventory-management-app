// // public/js/app.js

// let cart = []; // cart array
// let allProductsCache = []; // cached products

// /* ---------------------------
//    Utility: Refresh cache
// ----------------------------*/
// async function refreshAllProducts() {
//     try {
//         const res = await fetch('/api/products');
//         allProductsCache = await res.json();
//     } catch (err) {
//         console.error('Failed to refresh products:', err);
//         allProductsCache = [];
//     }
// }

// /* ---------------------------
//    Render: Home product grid
// ----------------------------*/
// async function renderProductGrid() {
//     const grid = document.getElementById('fastMovingItems');
//     if (!grid) return;

//     await refreshAllProducts();
//     renderFilteredGrid(allProductsCache.slice(0, 4));
// }

// function renderFilteredGrid(productsToRender) {
//     const grid = document.getElementById('fastMovingItems');
//     if (!grid) return;

//     if (!productsToRender || productsToRender.length === 0) {
//         grid.innerHTML = '<p>No products found matching your search criteria.</p>';
//         return;
//     }

//     grid.innerHTML = productsToRender.map(product => `
//         <div class="product-card">
//             <img src="${product.image_url}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150x100?text=No+Image'">
//             <h4>${product.name}</h4>
//             <p class="price">₹${product.unit_price}</p>
//             <p style="font-size: 0.9em; color: #555;">Stock: ${product.current_stock}</p>
//             <button onclick="addToCart('${product.product_id}', '${product.name}', ${product.unit_price})">Add to Cart</button>
//         </div>
//     `).join('');
// }

// /* ---------------------------
//    Search handler (home)
// ----------------------------*/
// function handleSearch() {
//     const searchInput = document.getElementById('productSearch');
//     if (!searchInput) return;
//     const searchTerm = searchInput.value.trim().toLowerCase();

//     if (searchTerm.length < 3 && searchTerm.length > 0) return;

//     if (!searchTerm) {
//         renderFilteredGrid(allProductsCache.slice(0, 4));
//         return;
//     }

//     const filtered = allProductsCache.filter(product =>
//         (product.name || '').toLowerCase().includes(searchTerm) ||
//         (product.category || '').toLowerCase().includes(searchTerm) ||
//         (product.product_code || '').toLowerCase().includes(searchTerm)
//     );

//     renderFilteredGrid(filtered);
// }

// /* ---------------------------
//    Product list (category page)
// ----------------------------*/
// async function renderProductList() {
//     const tableBody = document.getElementById('productListTableBody');
//     if (!tableBody) return;

//     const urlParams = new URLSearchParams(window.location.search);
//     const category = urlParams.get('category');
//     if (!category) return;

//     document.getElementById('categoryTitle').textContent = `All Varieties in ${category}`;

//     try {
//         const response = await fetch(`/api/products/${category}`);
//         const products = await response.json();

//         if (!products || products.length === 0) {
//             tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No items found in this category.</td></tr>';
//             return;
//         }

//         tableBody.innerHTML = products.map(product => {
//             const statusClass = product.current_stock === 0 ? 'status-oos' : '';
//             const actionDisabled = product.current_stock === 0 ? 'disabled' : '';
//             const actionText = product.current_stock === 0 ? 'Out of Stock' : 'Add to Cart';

//             return `
//                 <tr>
//                     <td>${product.product_id}</td>
//                     <td>${product.product_code}</td>
//                     <td>
//                         <img src="${product.image_url}" style="width: 50px; height: 30px; object-fit: cover; margin-right: 5px;">
//                         ${product.name}
//                     </td>
//                     <td>${product.description}</td>
//                     <td>${product.unit_price}</td>
//                     <td class="${statusClass}">${product.current_stock}</td>
//                     <td>${product.location}</td>
//                     <td><button class="action-btn" ${actionDisabled} onclick="addToCart('${product.product_id}', '${product.name}', ${product.unit_price})">${actionText}</button></td>
//                 </tr>
//             `;
//         }).join('');
//     } catch (err) {
//         console.error('Error fetching category products:', err);
//         tableBody.innerHTML = '<tr><td colspan="8" style="color:red; text-align:center;">Could not load products. Check server status.</td></tr>';
//     }
// }

// /* ---------------------------
//    Cart functions
// ----------------------------*/
// function addToCart(id, name, price) {
//     const existing = cart.find(i => i.id === id);
//     if (existing) existing.quantity += 1;
//     else cart.push({ id, name, price, quantity: 1 });

//     alert(`${name} added to cart!`);
//     renderCart();
// }

// function renderCart() {
//     const cartList = document.getElementById('cartList');
//     const cartTotalElement = document.getElementById('cartTotal');
//     if (!cartList || !cartTotalElement) return;

//     cartList.innerHTML = '';
//     let total = 0;

//     cart.forEach(item => {
//         const subtotal = item.price * item.quantity;
//         const itemElement = document.createElement('div');
//         itemElement.classList.add('cart-item');
//         itemElement.innerHTML = `<span>${item.name} (${item.quantity} x ₹${item.price})</span><span>₹${subtotal}</span>`;
//         cartList.appendChild(itemElement);
//         total += subtotal;
//     });

//     cartTotalElement.textContent = `Total: ₹${total}`;
// }

// /* ---------------------------
//    Reorder List (fixed 9-col)
// ----------------------------*/
// async function renderReorderList() {
//     const tableBody = document.getElementById('reorderTableBody');
//     if (!tableBody) return;

//     try {
//         const response = await fetch('/api/reorder-list');
//         const items = await response.json();

//         if (!items || items.length === 0) {
//             tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">No items currently below reorder point.</td></tr>';
//             return;
//         }

//         tableBody.innerHTML = items.map(item => {
//             const statusClass = item.current_stock === 0 ? 'status-oos' : 'status-low';
//             const statusText = item.current_stock === 0 ? 'OUT OF STOCK' : 'LOW STOCK';
//             const suggestedQty = Math.max(1, (item.needed_quantity !== undefined ? item.needed_quantity : (item.target_stock - item.current_stock)));

//             return `
//                 <tr>
//                     <td><input type="checkbox" name="select_order" value="${item.product_id}" checked></td>
//                     <td><span class="${statusClass}">${statusText}</span></td>
//                     <td>${item.name}</td>
//                     <td>${item.product_code}</td>
//                     <td>${item.current_stock}</td>
//                     <td>${item.reorder_point}</td>
//                     <td><input class="suggested-qty" type="number" value="${suggestedQty}" min="1" style="width:80px;"></td>
//                     <td>${item.last_vendor || 'Vendor X'}</td>
//                     <td>₹${item.unit_price}</td>
//                 </tr>
//             `;
//         }).join('');
//     } catch (err) {
//         console.error('Error fetching reorder list:', err);
//         tableBody.innerHTML = '<tr><td colspan="9" style="color:red; text-align:center;">Could not load reorder list.</td></tr>';
//     }
// }

// /* ---------------------------
//    Add New Product (Admin)
//    - kept original UX (prompt-based) but refreshes cache/UI
// ----------------------------*/
// function handleAddNewProduct() {
//     const name = prompt("Enter new Product Name (e.g., New Toy):");
//     const price = prompt("Enter Unit Price:");
//     const category = prompt("Enter Category (e.g., Toys):");

//     if (!name || !price || isNaN(price)) {
//         alert("Invalid input. Product not added.");
//         return;
//     }

//     const payload = {
//         name,
//         unit_price: parseFloat(price),
//         category,
//         initial_stock: 5
//     };

//     fetch('/api/admin/product', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//     })
//     .then(res => res.json())
//     .then(async data => {
//         alert(`SUCCESS: ${data.message} Product ID: ${data.product.product_id}.`);
//         await refreshAllProducts();
//         renderAdminProductList();
//         renderProductGrid();
//         renderReorderList();
//     })
//     .catch(err => {
//         console.error('Add failed:', err);
//         alert('Failed to add product.');
//     });
// }

// /* ---------------------------
//    Delete Product (Admin)
// ----------------------------*/
// function deleteProduct(productId, productName) {
//     if (!confirm(`Are you sure you want to delete ${productName} (${productId})? This action cannot be undone.`)) return;

//     fetch(`/api/admin/product/${productId}`, { method: 'DELETE' })
//     .then(async res => {
//         if (!res.ok) throw new Error('Delete failed');
//         await refreshAllProducts();
//         renderAdminProductList();
//         renderProductGrid();
//         renderReorderList();
//         alert(`${productName} deleted successfully.`);
//     })
//     .catch(err => {
//         console.error('Deletion failed:', err);
//         alert('Deletion failed.');
//     });
// }

// /* ---------------------------
//    Admin: Render all products (Manage All Products)
// ----------------------------*/
// async function renderAdminProductList() {
//     const tableBody = document.getElementById('adminProductsTableBody');
//     if (!tableBody) return;

//     try {
//         const response = await fetch('/api/products');
//         const products = await response.json();

//         tableBody.innerHTML = products.map(product => `
//             <tr>
//                 <td>${product.product_id}</td>
//                 <td>${product.name}</td>
//                 <td>${product.category}</td>
//                 <td>${product.unit_price}</td>
//                 <td><span class="${product.current_stock < product.reorder_point ? 'status-low' : ''}">${product.current_stock}</span></td>
//                 <td>${product.location}</td>
//                 <td>
//                     <button style="background-color: orange;">Edit</button>
//                     <button style="background-color: var(--danger-color);" onclick="deleteProduct('${product.product_id}', '${product.name}')">Delete</button>
//                 </td>
//             </tr>
//         `).join('');
//     } catch (err) {
//         console.error('Error fetching admin products:', err);
//         tableBody.innerHTML = '<tr><td colspan="7" style="color:red; text-align:center;">Could not load product list.</td></tr>';
//     }
// }

// /* ---------------------------
//    Stock-IN handler (record-in.html)
//    - Looks up product by product_id/product_code/name from cache
//    - Sends { productId, quantity } to backend
//    - Refreshes caches & UI
// ----------------------------*/
// function setupStockInHandler() {
//     const form = document.getElementById('stockInForm');
//     if (!form) return;

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const codeOrName = document.getElementById('productCode').value.trim();
//         const quantity = parseInt(document.getElementById('quantity').value, 10) || 0;

//         const product = allProductsCache.find(p =>
//             (p.product_id && p.product_id.toLowerCase() === codeOrName.toLowerCase()) ||
//             (p.product_code && p.product_code.toLowerCase() === codeOrName.toLowerCase()) ||
//             (p.name && p.name.toLowerCase() === codeOrName.toLowerCase())
//         );

//         if (!product) {
//             alert('Product not found!');
//             return;
//         }
//         if (quantity <= 0) {
//             alert('Enter a valid quantity.');
//             return;
//         }

//         try {
//             const res = await fetch('/api/admin/stock-in', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ productId: product.product_id, quantity })
//             });
//             const result = await res.json();
//             await refreshAllProducts();
//             renderReorderList();
//             renderAdminProductList();
//             renderProductGrid();
//             alert(`SUCCESS: ${result.message}\nProduct: ${product.name}`);
//             form.reset();
//         } catch (err) {
//             console.error('Stock IN failed:', err);
//             alert('Stock IN record failed.');
//         }
//     });
// }

// /* ---------------------------
//    Stock-OUT handler (record-out.html)
//    - Similar to stock-in but reduces stock
// ----------------------------*/
// function setupStockOutHandler() {
//     const form = document.getElementById('stockOutForm');
//     if (!form) return;

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const codeOrName = document.getElementById('productCodeOut').value.trim();
//         const quantity = parseInt(document.getElementById('quantityOut').value, 10) || 0;
//         const reason = document.getElementById('reason').value;

//         const product = allProductsCache.find(p =>
//             (p.product_id && p.product_id.toLowerCase() === codeOrName.toLowerCase()) ||
//             (p.product_code && p.product_code.toLowerCase() === codeOrName.toLowerCase()) ||
//             (p.name && p.name.toLowerCase() === codeOrName.toLowerCase())
//         );

//         if (!product) {
//             alert('Product not found!');
//             return;
//         }
//         if (quantity <= 0) {
//             alert('Enter a valid quantity.');
//             return;
//         }

//         // Optional: prevent stock-out > current_stock
//         if (product.current_stock !== undefined && quantity > product.current_stock) {
//             if (!confirm(`This will reduce stock below zero. Current stock: ${product.current_stock}. Proceed?`)) {
//                 return;
//             }
//         }

//         try {
//             const res = await fetch('/api/admin/stock-out-manual', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ productId: product.product_id, quantity, reason })
//             });
//             const result = await res.json();
//             await refreshAllProducts();
//             renderReorderList();
//             renderAdminProductList();
//             renderProductGrid();
//             alert(`SUCCESS: ${result.message}\nReason: ${reason}`);
//             form.reset();
//         } catch (err) {
//             console.error('Stock OUT failed:', err);
//             alert('Stock OUT record failed.');
//         }
//     });
// }

// /* ---------------------------
//    Initialization: bind events
// ----------------------------*/
// document.addEventListener('DOMContentLoaded', async () => {
//     // Always refresh the cache first
//     await refreshAllProducts();

//     // Sales view (home)
//     if (document.querySelector('.sales-layout') || document.getElementById('fastMovingItems')) {
//         renderProductGrid();
//         renderCart();
//         const searchInput = document.getElementById('productSearch');
//         if (searchInput) searchInput.addEventListener('keyup', handleSearch);
//         const searchBtn = document.querySelector('.search-container button');
//         if (searchBtn) searchBtn.addEventListener('click', handleSearch);
//     }

//     // Product list (category)
//     if (document.getElementById('productListTableBody')) {
//         await renderProductList();
//     }

//     // Admin product list
//     if (document.getElementById('adminProductsTableBody')) {
//         await renderAdminProductList();
//     }

//     // Reorder list
//     if (document.getElementById('reorderTableBody')) {
//         await renderReorderList();

//         // wire Add new product link
//         const addNewLink = document.getElementById('addNewProductLink');
//         if (addNewLink) {
//             addNewLink.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 handleAddNewProduct();
//             });
//         }
//     }

//     // Stock in/out forms
//     setupStockInHandler();
//     setupStockOutHandler();
// });



// public/js/app.js

/* =========================
   GLOBAL STATE
========================= */
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProductsCache = [];

/* =========================
   HELPERS
========================= */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/* =========================
   FETCH / CACHE
========================= */
async function refreshAllProducts() {
    try {
        const res = await fetch('/api/products');
        allProductsCache = await res.json();
    } catch (err) {
        console.error('Failed to load products:', err);
        allProductsCache = [];
    }
}

/* =========================
   PRODUCT GRID (HOME)
========================= */
async function renderProductGrid() {
    const grid = document.getElementById('fastMovingItems');
    if (!grid) return;

    await refreshAllProducts();
    renderFilteredGrid(allProductsCache.slice(0, 6));
}

function renderFilteredGrid(products) {
    const grid = document.getElementById('fastMovingItems');
    if (!grid) return;

    if (!products || products.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image_url || 'https://via.placeholder.com/150x100'}">
            <h4>${p.name}</h4>
            <p>₹${p.unit_price}</p>
            <p>Stock: ${p.current_stock}</p>
            <button ${p.current_stock === 0 ? 'disabled' : ''}
                onclick="addToCart('${p.product_id}','${p.name}',${p.unit_price})">
                ${p.current_stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `).join('');
}

/* =========================
   SEARCH (FIXED)
========================= */
function handleSearch() {
    const input = document.getElementById('productSearch');
    if (!input) return;

    const term = input.value.trim().toLowerCase();

    if (!term) {
        renderFilteredGrid(allProductsCache.slice(0, 6));
        return;
    }

    const filtered = allProductsCache.filter(p =>
        (p.name || '').toLowerCase().includes(term) ||
        (p.category || '').toLowerCase().includes(term) ||
        (p.product_code || '').toLowerCase().includes(term)
    );

    renderFilteredGrid(filtered);
}

/* =========================
   CART
========================= */
function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) item.quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });

    saveCart();
    renderCart();
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCart();
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartList || !cartTotal) return;

    cartList.innerHTML = '';

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name}<br>₹${item.price} × ${item.quantity}</span>
            <span>
                <button onclick="updateQuantity('${item.id}',-1)">−</button>
                <button onclick="updateQuantity('${item.id}',1)">+</button>
            </span>
        `;
        cartList.appendChild(div);
    });

    cartTotal.textContent = `Total: ₹${getCartTotal()}`;
}

/* =========================
   COMPLETE SALE
========================= */
async function completeSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    await fetch('/api/sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: cart.map(i => ({ id: i.id, qty: i.quantity }))
        })
    });

    cart = [];
    saveCart();
    await refreshAllProducts();
    renderProductGrid();
    renderCart();

    alert('Sale completed successfully!');
}

/* =========================
   INIT (ALL PAGES)
========================= */
document.addEventListener('DOMContentLoaded', async () => {
    await refreshAllProducts();

    // HOME
    if (document.getElementById('fastMovingItems')) {
        renderProductGrid();
        renderCart();

        const searchInput = document.getElementById('productSearch');
        const searchBtn = document.querySelector('.search-container button');

        if (searchInput) searchInput.addEventListener('keyup', handleSearch);
        if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    }

    // CHECKOUT
    const checkout = document.querySelector('.checkout-btn');
    if (checkout) checkout.addEventListener('click', completeSale);
});
