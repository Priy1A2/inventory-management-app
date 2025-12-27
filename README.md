# 📦 Inventory Management System

A full-stack Inventory Management web application built using **Node.js, Express, and Vanilla JavaScript**.  
This app helps shop owners and managers manage products, stock levels, sales, and reorder alerts efficiently.


## 🚀 Features

### 🛒 Sales & Billing
- Fast product search (name, category, product code)
- Quick-pick fast moving items
- Add items to cart
- Automatic stock reduction after sale

### 📦 Inventory Management
- View all products with current stock
- Category-wise product listing
- Reorder alert system (low / out-of-stock)
- Suggested reorder quantities

### 🧑‍💼 Admin Dashboard
- Add new products
- Delete products
- Stock IN (purchase / restock)
- Stock OUT (wastage / manual adjustment)

### 📊 Reports
- Reorder list
- Low stock & out-of-stock indicators

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Data Storage:** In-memory JSON (for demo)
- **Styling:** Custom CSS (Dark theme)

---

## 📁 Project Structure

Inventory_management/
├── public/ # Frontend files (HTML, CSS, JS)
├── server/ # Backend files
│ ├── data/ # Inventory data (JSON)
│ ├── server.js # Main server file
├── package.json # Node.js dependencies
└── README.md


## ⚡ Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/Priy1A2/inventory-management-app.git
cd inventory-management-app
npm install
cd server
node server.js
