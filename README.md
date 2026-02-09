B2B WAREHOUSE MANAGEMENT PLATFORM

A modern, spatial, keyboard-first Order Management System (OMS) designed for B2B teams managing multi-warehouse operations.

# GETTING STARTED

1. Clone the repository
2. Install frontend: pnpm install
3. Setup backend:
   cd backend
   python -m venv venv
   source venv/bin/activate (or venv\Scripts\activate on Windows)
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
4. Run:
   Frontend: pnpm run dev
   Backend: python manage.py runserver

# HOW TO USE THIS APP

1. Dashboard Overview
   When you log in, you are greeted by the Dashboard. This is your command center.
   - The top cards show you critical metrics: Revenue, Active Orders, Inventory alerts.
   - Use the sidebar (or top tabs) to navigate between sections: Orders, Inventory, Customers, Analytics.

2. Managing Inventory
   - Navigate to the Inventory tab.
   - Click "Add Product" to create new items in your catalog.
   - You can set the price, cost, and initial stock level.
   - If stock runs low, the system will alert you.

3. Managing Customers
   - Go to the Customers tab.
   - Add new business clients with their details and credit limits.
   - You can view their order history and total spending.

4. Creating Orders
   - From any screen, you can press the "New Order" button.
   - Select a Customer from the dropdown.
   - Add Products to the order.
   - The system automatically checks if there is enough stock in your warehouses.
   - Once created, the order status starts as "Pending".

5. Order Fulfillment
   - As you process the physical goods, update the order status.
   - Change status from Pending -> Processing -> Shipped -> Delivered.
   - Updating status to Shipped/Delivered creates a permanent record of the sale for reports.

# KEY CONCEPTS AND LOGIC

Here is how the core business logic works in plain English and pseudocode.

1. WAREHOUSE
   A Warehouse is a physical location structure where products are stored.
   logic:
     A Warehouse has [Name, Location, Capacity]
     An InventoryItem links a Product to a Warehouse with a specific Quantity.
     
     Total Stock for Product A = Sum of Product A quantity in Warehouse 1 + Warehouse 2 + ...

2. CREDITS (CUSTOMER CREDIT LIMIT)
   Credits refer to the "Credit Limit" assigned to a customer. This is the maximum monetary value of unpaid orders a customer is allowed to have.
   
   PSEUDOCODE CHECKING CREDIT LIMIT:
     INPUT: Customer, NewOrderTotal
     
     CurrentDebt = Sum of all unpaid orders for Customer
     AvailableCredit = Customer.CreditLimit - CurrentDebt
     
     IF NewOrderTotal > AvailableCredit THEN
         REJECT Order ("Credit Limit Exceeded")
     ELSE
         APPROVE Order
         Subtract stock from Inventory
         Add Order to Customer History
     END IF

3. SALES
   A Sale is a confirmed Order. It represents a contract to deliver goods in exchange for money.
   
   PSEUDOCODE CREATING A SALE:
     INPUT: Customer, ItemsList
     
     TotalAmount = 0
     
     FOR EACH Item IN ItemsList:
         Product = FindProduct(Item.ID)
         
         IF Product.Stock < Item.Quantity THEN
             ERROR "Insufficient Stock"
             STOP PROCESS
         END IF
         
         ItemTotal = Product.Price * Item.Quantity
         TotalAmount = TotalAmount + ItemTotal
     END FOR
     
     Create Order Record(Customer, TotalAmount, Status="Pending")
     
     FOR EACH Item IN ItemsList:
         Inventory.Product.Stock = Inventory.Product.Stock - Item.Quantity
         Save OrderItem Record
     END FOR
     
     RETURN Success

4. PROFIT
   Profit is the financial gain from sales, calculated as Revenue minus Cost of Goods Sold (COGS).
   - Revenue: The price you sell the product for.
   - Cost: The price you bought/manufactured the product for.
   
   PSEUDOCODE CALCULATING PROFIT:
     INPUT: TimePeriod (e.g., "Last Month")
     
     TotalRevenue = 0
     TotalCost = 0
     
     Orders = GetAllOrders(TimePeriod)
     
     FOR EACH Order IN Orders:
         IF Order.Status is NOT "Cancelled" THEN
             TotalRevenue = TotalRevenue + Order.TotalAmount
             
             FOR EACH Item IN Order:
                 ItemCost = Item.Product.Cost * Item.Quantity
                 TotalCost = TotalCost + ItemCost
             END FOR
         END IF
     END FOR
     
     GrossProfit = TotalRevenue - TotalCost
     NetProfit = GrossProfit - OperationalExpenses (like Shipping, Rent)
     
     DISPLAY GrossProfit

# FEATURES AND TECH STACK

FEATURES

Core Functionality
  Multi-Warehouse Management
  Order Processing
  Purchase Order System
  Real-time Stock Tracking
  Smart Allocation Engine
  Customer Management
  Advanced Reporting

User Experience
  Interactive 3D Globe
  Glassmorphic UI
  Keyboard Shortcuts
  Real-time Updates
  Responsive Design
  Dark Theme

Tech Stack
  Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion
  Backend: Django, Django REST Framework, SQLite

# PROJECT STRUCTURE

B2B2/
  src/
    app/ (Frontend Pages)
    components/ (UI Elements)
    lib/ (Helpers)
  backend/
    orders/
    inventory/
    customers/
    reports/

# AUTHOR

A Portfolio Project demonstrating advanced React and full-stack capabilities.
