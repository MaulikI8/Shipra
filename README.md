# 🏭 Shipra - B2B Inventory Management System

A modern, full-stack B2B warehouse and inventory management platform built with React and Django. Features real-time stock tracking, order management, customer relationship tools, and advanced analytics.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Core Functionality
- 📦 **Multi-Warehouse Management** - Track inventory across multiple locations
- 🛒 **Order Processing** - Complete order lifecycle from creation to delivery
- 📊 **Real-time Stock Tracking** - Automatic stock status updates (In Stock, Low Stock, Out of Stock)
- 👥 **Customer Management** - CRM with credit limits and order history
- 📈 **Advanced Analytics** - Revenue trends, product performance, warehouse efficiency
- 🏷️ **Product Catalog** - SKU management with images, categories, and pricing
- 🚚 **Shipment Tracking** - Editable tracking numbers for order fulfillment

### User Experience
- 🎨 **Glassmorphic UI** - Modern, premium design with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌙 **Dark Theme** - Eye-friendly dark mode interface
- ⚡ **Real-time Updates** - Live data synchronization
- 🔍 **Advanced Filtering** - Search and filter across all modules
- 📤 **Export Reports** - CSV, Excel, and PDF export capabilities

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Django 5.0** - Web framework
- **Django REST Framework** - API development
- **SQLite** - Database (easily swappable to PostgreSQL/MySQL)
- **Pillow** - Image processing
- **JWT Authentication** - Secure token-based auth

---

## 📁 Project Structure

```
B2B2/
├── backend/                    # Django Backend
│   ├── config/                # Project settings
│   ├── orders/                # Order management app
│   ├── inventory/             # Product & stock management
│   ├── customers/             # Customer relationship management
│   ├── warehouses/            # Warehouse locations
│   ├── reports/               # Analytics & reporting
│   ├── notifications/         # User notifications
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
│
├── src/                       # React Frontend
│   ├── app/                   # Page components
│   │   ├── Dashboard.tsx      # Main dashboard
│   │   ├── Orders.tsx         # Order list & management
│   │   ├── OrderDetail.tsx    # Individual order view
│   │   ├── Inventory.tsx      # Product catalog
│   │   ├── Customers.tsx      # Customer management
│   │   └── Reports.tsx        # Analytics & reports
│   ├── components/            # Reusable UI components
│   │   ├── SystemDock.tsx     # Bottom navigation
│   │   ├── GlassCard.tsx      # Card component
│   │   └── ...
│   ├── lib/                   # Utilities
│   │   ├── api.ts             # API client
│   │   ├── export.ts          # Export utilities
│   │   └── toast.ts           # Notifications
│   └── main.tsx               # App entry point
│
├── public/                    # Static assets
├── package.json               # Node dependencies
├── vite.config.ts             # Vite configuration
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/pnpm
- **Python** 3.11+
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MaulikI8/Shipra.git
   cd Shipra
   ```

2. **Setup Backend (Django)**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser (admin account)
   python manage.py createsuperuser
   
   # Start Django server
   python manage.py runserver
   ```
   Backend will run at: `http://localhost:8000`

3. **Setup Frontend (React)**
   ```bash
   # From project root
   npm install
   # or
   pnpm install
   
   # Start development server
   npm run dev
   # or
   pnpm run dev
   ```
   Frontend will run at: `http://localhost:5173`

4. **Access the Application**
   - Open browser to `http://localhost:5173`
   - Login with your superuser credentials
   - Start managing your inventory!

---

## 📖 Usage Guide

### 1. Dashboard Overview
The dashboard is your command center showing:
- **Revenue metrics** - Total sales and trends
- **Active orders** - Current order count
- **Inventory alerts** - Low stock warnings
- **Quick stats** - Products, customers, warehouses

### 2. Managing Inventory
- Navigate to **Inventory** section
- Click **"Add Product"** to create new items
- Set SKU, name, price, cost, and upload images
- Stock levels update automatically based on orders
- Status badges show: IN STOCK, LOW STOCK, OUT OF STOCK

### 3. Managing Customers
- Go to **Customers** tab
- Add business clients with contact details
- Set credit limits for each customer
- View order history and total spending
- Track customer lifetime value

### 4. Creating Orders
- Click **"New Order"** from any screen
- Select customer from dropdown
- Add products to cart
- System validates stock availability
- Order starts as "Pending" status

### 5. Order Fulfillment
- Update order status: Pending → Processing → Shipped → Delivered
- Add tracking numbers for shipments
- Copy tracking info to share with customers
- Completed orders appear in revenue reports

### 6. Analytics & Reports
- View **Revenue Trends** over 6 or 12 months
- Analyze **Category Distribution** with pie charts
- Check **Top Products** by revenue and sales
- Monitor **Warehouse Efficiency** metrics
- Export reports as CSV, Excel, or PDF

---

## 🔌 API Documentation

### Authentication
All API endpoints require JWT authentication (except login/register).

**Login**
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Key Endpoints

**Products**
- `GET /api/inventory/products/` - List all products
- `POST /api/inventory/products/` - Create product
- `GET /api/inventory/products/{id}/` - Get product details
- `POST /api/inventory/products/{id}/restock/` - Add stock

**Orders**
- `GET /api/orders/` - List orders
- `POST /api/orders/` - Create order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/` - Update order
- `PATCH /api/orders/{id}/update_status/` - Change status

**Reports**
- `GET /api/reports/dashboard/` - Dashboard stats
- `GET /api/reports/revenue/?months=6` - Revenue report
- `GET /api/reports/products/` - Product performance
- `GET /api/reports/category/` - Category distribution
- `GET /api/reports/warehouses/` - Warehouse efficiency

---

## 🎨 Key Concepts

### Warehouse Logic
```
A Warehouse has: Name, Location, Capacity
An InventoryItem links: Product + Warehouse + Quantity

Total Stock for Product A = Sum(Product A in all warehouses)
```

### Stock Status Calculation
```python
if total_stock == 0:
    status = "OUT OF STOCK"
elif any warehouse has stock <= threshold:
    status = "LOW STOCK"
else:
    status = "IN STOCK"
```

### Order Processing
```
1. Customer selects products
2. System checks stock availability
3. System validates customer credit limit
4. Order created with status "Pending"
5. Stock deducted from inventory
6. Status updates: Processing → Shipped → Delivered
7. Revenue recorded in reports
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Maulik Joshi**
- GitHub: [@MaulikI8](https://github.com/MaulikI8)
- Email: jmaulik21@gmail.com

---

## 🙏 Acknowledgments

Built as a portfolio project demonstrating full-stack development capabilities with modern web technologies.

---

**⭐ If you find this project useful, please consider giving it a star!**
