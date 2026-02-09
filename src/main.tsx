import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './app/LandingPage'
import LoginPage from './app/LoginPage'
import SignupPage from './app/SignupPage'
import Dashboard from './app/Dashboard'
import OrderDetail from './app/OrderDetail'
import InventoryDetail from './app/InventoryDetail'
import WarehouseManagement from './app/WarehouseManagement'
import CustomerManagement from './app/CustomerManagement'
import CustomerDetail from './app/CustomerDetail'
import Reports from './app/Reports'
import NotificationsCenter from './app/NotificationsCenter'
import PurchaseOrders from './app/PurchaseOrders'
import NotFound from './app/NotFound'
import { ErrorBoundary } from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/inventory/:itemId" element={<ProtectedRoute><InventoryDetail /></ProtectedRoute>} />
          <Route path="/warehouses" element={<ProtectedRoute><WarehouseManagement /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} />
          <Route path="/customers/:customerId" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsCenter /></ProtectedRoute>} />
          <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

