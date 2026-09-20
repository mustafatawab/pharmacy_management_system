from fastapi.testclient import TestClient

def test_create_category(client: TestClient):
    response = client.post(
        "/category/",
        json={
            "name": "Antibiotics",
            "description": "Bacterial infections"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Antibiotics"
    return data["id"]

def test_create_medicine(client: TestClient):
    category_id = test_create_category(client)
    
    response = client.post(
        "/medicine/",
        json={
            "name": "Amoxicillin 500mg",
            "generic_salt": "Amoxicillin",
            "category_id": category_id,
            "unit": "capsule",
            "base_unit": "unit",
            "quantity": 0,
            "purchase_price": 5.0,
            "selling_price": 12.0,
            "reorder_level": 50,
            "target_max_stock": 200,
            "is_narcotic": False,
            "prescription_required": True
        }
    )
    assert response.status_code == 200 # Usually 200 or 201
    data = response.json()
    assert data["name"] == "Amoxicillin 500mg"
    assert data["generic_salt"] == "Amoxicillin"
    return data["id"]
