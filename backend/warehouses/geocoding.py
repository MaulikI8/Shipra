import requests
from typing import Optional, Tuple


def geocode_address(address: str, city: str, state: str, country: str = 'USA') -> Optional[Tuple[float, float]]:
    """
    Geocode an address using Nominatim (OpenStreetMap) API.
    Returns (latitude, longitude) tuple or None if geocoding fails.
    """
    try:
        # Construct full address
        full_address = f"{address}, {city}, {state}, {country}"
        
        # Nominatim API endpoint
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            'q': full_address,
            'format': 'json',
            'limit': 1
        }
        headers = {
            'User-Agent': 'B2B-Warehouse-App/1.0'  # Required by Nominatim
        }
        
        response = requests.get(url, params=params, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                lat = float(data[0]['lat'])
                lon = float(data[0]['lon'])
                return (lat, lon)
        
        return None
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None
