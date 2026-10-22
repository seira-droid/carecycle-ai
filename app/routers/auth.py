from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from app.services.auth_service import auth_service

router = APIRouter()

class LoginRequest(BaseModel):
    email: str = Field(..., description="User account email")
    password: str = Field(..., min_length=1, description="Account password")

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, description="User full or preferred name")
    email: str = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password (at least 6 characters)")
    pronouns: Optional[str] = "she/they"
    age: Optional[int] = 18
    neurodiversity: Optional[List[str]] = ["Neurodivergent"]

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    reset_token: str
    new_password: str = Field(..., min_length=6)

def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    if not authorization:
        return None
    token = authorization.replace("Bearer ", "").strip()
    return auth_service.verify_token(token)

def get_current_user_required(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token required. Please log in.")
    token = authorization.replace("Bearer ", "").strip()
    user = auth_service.verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please sign in again.")
    return user

@router.post("/login")
async def login(req: LoginRequest):
    """Authenticates user with email & password and returns secure session token."""
    try:
        return auth_service.login(req.email, req.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/register")
async def register(req: RegisterRequest):
    """Registers a new user and issues a session token."""
    try:
        return auth_service.register(
            email=req.email,
            password=req.password,
            name=req.name,
            pronouns=req.pronouns or "she/they",
            age=req.age or 18,
            neurodiversity=req.neurodiversity
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_current_user(current_user: Dict[str, Any] = Depends(get_current_user_required)):
    """Returns profile for currently authenticated user."""
    return current_user

@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """Terminates active session token."""
    if authorization:
        token = authorization.replace("Bearer ", "").strip()
        auth_service.logout(token)
    return {"message": "Logged out successfully"}

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    """Generates password recovery instructions."""
    return auth_service.request_password_reset(req.email)

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    """Resets user password with a verified reset token."""
    try:
        return auth_service.confirm_password_reset(req.email, req.reset_token, req.new_password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
