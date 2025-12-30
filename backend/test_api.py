import requests
import json

try:
    response = requests.get("http://127.0.0.1:8000/agenda/?limit=5")
    response.raise_for_status()
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Number of items: {len(data)}")
    
    if len(data) > 0:
        print("First item sample:")
        print(json.dumps(data[0], indent=2))
        
        # Check specific fields expected by frontend
        item = data[0]
        required = ['fecha', 'hora', 'persona', 'cargo', 'descripcion']
        missing = [f for f in required if f not in item]
        if missing:
            print(f"WARNING: Missing fields: {missing}")
        else:
            print("All required fields present.")
            
        # Check date format
        print(f"Date format: {item.get('fecha')}")
    else:
        print("No items returned.")

except Exception as e:
    print(f"Error: {e}")
