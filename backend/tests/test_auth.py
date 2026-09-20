from fastapi.testclient import TestClient

def test_login_success(client: TestClient):
    # Temporarily remove auth cookie just for the login test
    client.cookies.delete("access_token")
    
    response = client.post(
        "/auth/login",
        json={"login": "admin@test.com", "password": "password"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Login successful"

def test_login_wrong_password(client: TestClient):
    client.cookies.delete("access_token")
    
    response = client.post(
        "/auth/login",
        json={"login": "admin@test.com", "password": "wrongpassword"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username/email or password"
