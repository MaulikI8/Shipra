/**
 * API Client for Django Backend
 * This is our main communication hub with the backend
 * Handles all HTTP requests with JWT authentication
 * Think of it as a translator between React and Django
 */

// Where our backend lives - can be overridden with environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Keep track of our authentication tokens
// These are stored in localStorage so they persist across page refreshes
let accessToken: string | null = localStorage.getItem('access_token')
let refreshToken: string | null = localStorage.getItem('refresh_token')

// Save tokens when user logs in or registers
export const setTokens = (access: string, refresh: string) => {
  accessToken = access
  refreshToken = refresh
  // Store them so they survive page refreshes
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

// Clear tokens when user logs out
export const clearTokens = () => {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// Get the current access token (useful for debugging)
export const getAccessToken = () => accessToken

// This is the main function that makes all our API calls
// It handles authentication, token refresh, and error handling automatically
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_URL}${endpoint}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  // Add the JWT token to requests (except login/register where we don't have one yet)
  if (accessToken && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // If we get a 401 (unauthorized), our token probably expired
  // Try to refresh it automatically
  if (response.status === 401 && refreshToken && !endpoint.includes('/auth/')) {
    try {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        // Got a new token! Retry the original request
        const newHeaders = {
          ...headers,
          'Authorization': `Bearer ${accessToken}`
        }
        return fetch(url, {
          ...options,
          headers: newHeaders,
        })
      } else {
        // Refresh failed (returned false) - session is truly dead
        clearTokens()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return response
      }
    } catch (error) {
      // Refresh failed (threw error) - user needs to log in again
      clearTokens()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
      throw error
    }
  }

  return response
}

// When the access token expires, use the refresh token to get a new one
// This happens automatically in the background - user doesn't notice
async function refreshAccessToken(): Promise<boolean> {
  if (!refreshToken) return false  // Can't refresh without a refresh token

  try {
    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (response.ok) {
      const data = await response.json()
      accessToken = data.access  // Save the new access token
      localStorage.setItem('access_token', data.access)
      return true
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
  }

  return false
}

// API Methods
export const api = {
  // Authentication
  async register(data: {
    username: string
    email: string
    password: string
    password2: string
    first_name: string
    last_name: string
    company: string
    phone?: string
  }) {
    const response = await apiRequest('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    const result = await response.json()
    if (response.ok && result.tokens) {
      setTokens(result.tokens.access, result.tokens.refresh)
    }
    return { response, data: result }
  },

  async login(email: string, password: string) {
    const response = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const result = await response.json()
    if (response.ok && result.tokens) {
      setTokens(result.tokens.access, result.tokens.refresh)
    }
    return { response, data: result }
  },

  async logout() {
    if (refreshToken) {
      try {
        await apiRequest('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    clearTokens()
  },

  async getProfile() {
    const response = await apiRequest('/auth/profile/')
    return { response, data: await response.json() }
  },

  async updateProfile(data: Partial<{
    first_name: string
    last_name: string
    email: string
    company: string
    phone: string
    avatar: any
  }>) {
    let body: BodyInit
    
    const hasFile = !!data.avatar
    
    if (hasFile) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any)
        }
      })
      body = formData
    } else {
      body = JSON.stringify(data)
    }

    const response = await apiRequest('/auth/profile/', {
      method: 'PUT',
      body,
    })
    return { response, data: await response.json() }
  },

  // ========== Orders ==========
  // Everything related to customer orders
  async getOrders(page = 1) {
    const response = await apiRequest(`/orders/?page=${page}`)
    return { response, data: await response.json() }
  },

  async getOrder(id: number) {
    const response = await apiRequest(`/orders/${id}/`)
    return { response, data: await response.json() }
  },

  async createOrder(data: {
    customer: number
    items: Array<{ product_id: number; quantity: number; unit_price: number }>
    status?: string
  }) {
    const response = await apiRequest('/orders/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return { response, data: await response.json() }
  },

  async updateOrder(id: number, data: any) {
    const response = await apiRequest(`/orders/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return { response, data: await response.json() }
  },

  async updateOrderStatus(id: number, status: string) {
    const response = await apiRequest(`/orders/${id}/update_status/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return { response, data: await response.json() }
  },

  // ========== Inventory ==========
  // Product management and stock levels
  async getProducts(page = 1) {
    const response = await apiRequest(`/inventory/products/?page=${page}`)
    return { response, data: await response.json() }
  },

  async getProduct(id: number) {
    const response = await apiRequest(`/inventory/products/${id}/`)
    return { response, data: await response.json() }
  },

  async createProduct(data: {
    sku: string
    name: string
    description?: string
    category_id?: number
    price: number
    cost?: number
    image?: File
  }) {
    const formData = new FormData()
    formData.append('sku', data.sku)
    formData.append('name', data.name)
    formData.append('price', data.price.toString())
    if (data.description) formData.append('description', data.description)
    if (data.category_id) formData.append('category_id', data.category_id.toString())
    if (data.cost) formData.append('cost', data.cost.toString())
    if (data.image) formData.append('image', data.image)
    
    const url = `${API_URL}/inventory/products/`
    const headers: HeadersInit = {}
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    // Don't set Content-Type for FormData, browser will set it with boundary
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    })
    
    return { response, data: await response.json() }
  },

  async restockProduct(id: number, warehouseId: number, quantity: number) {
    const response = await apiRequest(`/inventory/products/${id}/restock/`, {
      method: 'POST',
      body: JSON.stringify({ warehouse_id: warehouseId, quantity }),
    })
    return { response, data: await response.json() }
  },

  // ========== Customers ==========
  // Customer information and management
  async getCustomers(page = 1, search = '') {
    const query = search ? `&search=${encodeURIComponent(search)}` : ''
    const response = await apiRequest(`/customers/?page=${page}${query}`)
    return { response, data: await response.json() }
  },

  async getCustomerStats() {
    const response = await apiRequest('/customers/stats/')
    return { response, data: await response.json() }
  },

  async getCustomer(id: number) {
    const response = await apiRequest(`/customers/${id}/`)
    return { response, data: await response.json() }
  },

  async createCustomer(data: {
    name: string
    company: string
    email: string
    phone?: string
    address?: string
    credit_limit?: number
    payment_terms?: string
  }) {
    const response = await apiRequest('/customers/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return { response, data: await response.json() }
  },

  // ========== Warehouses ==========
  // Warehouse locations and management
  async getWarehouses() {
    const response = await apiRequest('/warehouses/')
    return { response, data: await response.json() }
  },

  async getWarehouse(id: number) {
    const response = await apiRequest(`/warehouses/${id}/`)
    return { response, data: await response.json() }
  },

  async getWarehouseStats() {
    const response = await apiRequest('/warehouses/stats/')
    return { response, data: await response.json() }
  },

  async createWarehouse(data: {
    name: string
    address: string
    city: string
    state: string
    country?: string
    zip_code: string
    capacity?: number
    latitude?: number
    longitude?: number
  }) {
    const response = await apiRequest('/warehouses/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return { response, data: await response.json() }
  },

  async deleteWarehouse(id: number) {
    const response = await apiRequest(`/warehouses/${id}/`, {
      method: 'DELETE',
    })
    return { response }
  },

  // ========== Notifications ==========
  async getNotifications() {
    const response = await apiRequest('/notifications/')
    return { response, data: await response.json() }
  },

  async markNotificationRead(id: number) {
    const response = await apiRequest(`/notifications/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ read: true })
    })
    return { response, data: await response.json() }
  },

  async markAllNotificationsRead() {
    const response = await apiRequest('/notifications/mark_all_read/', {
      method: 'POST'
    })
    return { response, data: await response.json() }
  },

  async deleteNotification(id: number) {
    const response = await apiRequest(`/notifications/${id}/`, {
      method: 'DELETE'
    })
    return { response }
  },

  // ========== Dashboard ==========
  // Aggregated stats for the main dashboard
  async getDashboardStats() {
    const response = await apiRequest('/reports/dashboard/')
    return { response, data: await response.json() }
  },

  // ========== Reports ==========
  // Analytics and reporting endpoints
  async getRevenueReport(months = 6) {
    const response = await apiRequest(`/reports/revenue/?months=${months}`)
    return { response, data: await response.json() }
  },

  async getProductPerformance() {
    const response = await apiRequest('/reports/products/')
    return { response, data: await response.json() }
  },

  async getCategoryPerformance() {
    const response = await apiRequest('/reports/category/')
    return { response, data: await response.json() }
  },

  async getWarehousePerformance() {
    const response = await apiRequest('/reports/warehouses/')
    return { response, data: await response.json() }
  },


}

// ========== Helper Functions ==========

// Quick check if user is logged in
export const isAuthenticated = () => {
  return !!accessToken  // If we have a token, we're logged in
}

// Get user data from localStorage (if we stored it)
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Save user data to localStorage
export const setStoredUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user))
}

