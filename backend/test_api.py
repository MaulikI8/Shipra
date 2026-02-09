"""
Quick API test script to verify all endpoints work.
Run this after starting the server: python manage.py runserver
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_auth():
    """Test authentication endpoints."""
    print("\n" + "="*50)
    print("TESTING AUTHENTICATION")
    print("="*50)
    
    # Test Register
    print("\n1. Testing Register...")
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "password2": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "company": "Test Company"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"   ✓ User registered: {data['user']['username']}")
            tokens = data['tokens']
            return tokens['access'], tokens['refresh'], data['user']
        else:
            print(f"   ✗ Error: {response.text}")
            # Try login instead
            return test_login()
    except Exception as e:
        print(f"   ✗ Connection error: {e}")
        return None, None, None
    
def test_login():
    """Test login endpoint."""
    print("\n2. Testing Login...")
    login_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Login successful: {data['user']['username']}")
            tokens = data['tokens']
            return tokens['access'], tokens['refresh'], data['user']
        else:
            print(f"   ✗ Error: {response.text}")
            return None, None, None
    except Exception as e:
        print(f"   ✗ Connection error: {e}")
        return None, None, None

def test_profile(access_token):
    """Test profile endpoint."""
    print("\n3. Testing Profile...")
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        response = requests.get(f"{BASE_URL}/auth/profile/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Profile retrieved: {data['username']} ({data['company']})")
            return True
        else:
            print(f"   ✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False

def test_warehouses(access_token):
    """Test warehouses endpoint."""
    print("\n" + "="*50)
    print("TESTING WAREHOUSES")
    print("="*50)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # List warehouses
    print("\n1. Testing GET /warehouses/...")
    try:
        response = requests.get(f"{BASE_URL}/warehouses/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Found {len(data.get('results', data))} warehouses")
            return True
        else:
            print(f"   ✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False

def test_customers(access_token):
    """Test customers endpoint."""
    print("\n" + "="*50)
    print("TESTING CUSTOMERS")
    print("="*50)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # List customers
    print("\n1. Testing GET /customers/...")
    try:
        response = requests.get(f"{BASE_URL}/customers/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Found {len(data.get('results', data))} customers")
            return True
        else:
            print(f"   ✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False

def test_orders(access_token):
    """Test orders endpoint."""
    print("\n" + "="*50)
    print("TESTING ORDERS")
    print("="*50)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # List orders
    print("\n1. Testing GET /orders/...")
    try:
        response = requests.get(f"{BASE_URL}/orders/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Found {len(data.get('results', data))} orders")
            return True
        else:
            print(f"   ✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False

def test_inventory(access_token):
    """Test inventory endpoint."""
    print("\n" + "="*50)
    print("TESTING INVENTORY")
    print("="*50)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # List products
    print("\n1. Testing GET /inventory/products/...")
    try:
        response = requests.get(f"{BASE_URL}/inventory/products/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Found {len(data.get('results', data))} products")
            return True
        else:
            print(f"   ✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False

def test_reports(access_token):
    """Test reports endpoint."""
    print("\n" + "="*50)
    print("TESTING REPORTS")
    print("="*50)
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Revenue report
    print("\n1. Testing GET /reports/revenue/...")
    try:
        response = requests.get(f"{BASE_URL}/reports/revenue/", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Revenue report retrieved: {len(data)} months")
            return True
        else:
            print(f"   ✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False

def main():
    print("\n" + "="*50)
    print("BACKEND API TEST SUITE")
    print("="*50)
    print("\nMake sure the server is running: python manage.py runserver")
    print("Press Enter to continue...")
    input()
    
    # Test authentication
    access_token, refresh_token, user = test_auth()
    
    if not access_token:
        print("\n❌ Authentication failed. Cannot continue testing.")
        return
    
    # Test profile
    test_profile(access_token)
    
    # Test all endpoints
    results = {
        "Warehouses": test_warehouses(access_token),
        "Customers": test_customers(access_token),
        "Orders": test_orders(access_token),
        "Inventory": test_inventory(access_token),
        "Reports": test_reports(access_token),
    }
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    for feature, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{feature}: {status}")
    
    print("\n" + "="*50)

if __name__ == "__main__":
    main()

