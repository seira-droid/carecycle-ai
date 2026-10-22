from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success():
    """Tests successful login with pre-seeded demo clinical account."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "elena.vance@carecycle.health", "password": "CareCycle2026!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "elena.vance@carecycle.health"
    assert "password_hash" not in data["user"]

def test_login_invalid_password():
    """Tests login rejection with incorrect credentials."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "elena.vance@carecycle.health", "password": "WrongPassword99!"}
    )
    assert response.status_code == 400
    assert "Invalid email or password" in response.json()["detail"]

def test_registration_and_me():
    """Tests new user registration and authenticated /me retrieval."""
    import secrets
    test_email = f"test_{secrets.token_hex(4)}@carecycle.health"
    reg_response = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Sarah Connor",
            "email": test_email,
            "password": "SecurePassword123!",
            "pronouns": "she/her",
            "age": 20
        }
    )
    assert reg_response.status_code == 200
    reg_data = reg_response.json()
    token = reg_data["access_token"]
    assert token.startswith("cc_")

    # Access /me with token
    me_response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    assert me_response.json()["email"] == test_email

    # Logout
    logout_res = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert logout_res.status_code == 200

    # Ensure token is now invalid
    me_after_logout = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_after_logout.status_code == 401
