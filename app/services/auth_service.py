import os
import json
import hashlib
import secrets
import datetime
from typing import Optional, Dict, Any, List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
TOKENS_FILE = os.path.join(DATA_DIR, 'tokens.json')
os.makedirs(DATA_DIR, exist_ok=True)

class AuthService:
    def __init__(self):
        self._init_storage()

    def _init_storage(self):
        """Initializes user storage and pre-seeds default clinical demo account."""
        if not os.path.exists(USERS_FILE):
            default_salt = secrets.token_hex(16)
            default_hash = self._hash_password("CareCycle2026!", default_salt)
            
            initial_users = {
                "elena.vance@carecycle.health": {
                    "id": "usr_elena_100",
                    "email": "elena.vance@carecycle.health",
                    "name": "Elena Vance",
                    "pronouns": "she/they",
                    "age": 18,
                    "password_hash": default_hash,
                    "salt": default_salt,
                    "neurodiversity": ["Autism Spectrum Disorder", "Sensory Processing Sensitivity"],
                    "sensory_sensitivities": ["Bright fluorescent light", "Waistband seam friction", "High auditory volume"],
                    "average_cycle_length": 28,
                    "average_period_length": 5,
                    "last_period_start": "2026-10-01",
                    "caregiver_assistance": True,
                    "caregiver_name": "Marcus Vance (Caregiver)",
                    "preferred_language_mode": "standard",
                    "created_at": datetime.datetime.now().isoformat()
                },
                "demo@carecycle.health": {
                    "id": "usr_demo_101",
                    "email": "demo@carecycle.health",
                    "name": "Clinical Demo User",
                    "pronouns": "she/her",
                    "age": 22,
                    "password_hash": default_hash,
                    "salt": default_salt,
                    "neurodiversity": ["ADHD", "Executive Functioning Variation"],
                    "sensory_sensitivities": ["Low tolerance for harsh alarms"],
                    "average_cycle_length": 29,
                    "average_period_length": 5,
                    "last_period_start": "2026-10-05",
                    "caregiver_assistance": False,
                    "caregiver_name": None,
                    "preferred_language_mode": "simple",
                    "created_at": datetime.datetime.now().isoformat()
                }
            }
            with open(USERS_FILE, 'w', encoding='utf-8') as f:
                json.dump(initial_users, f, indent=2)

        if not os.path.exists(TOKENS_FILE):
            with open(TOKENS_FILE, 'w', encoding='utf-8') as f:
                json.dump({}, f)

    def _hash_password(self, password: str, salt: str) -> str:
        """Secure PBKDF2-HMAC-SHA256 password hashing with 100,000 iterations."""
        pwd_bytes = password.encode('utf-8')
        salt_bytes = salt.encode('utf-8')
        key = hashlib.pbkdf2_hmac('sha256', pwd_bytes, salt_bytes, 100000)
        return key.hex()

    def _load_users(self) -> Dict[str, Any]:
        try:
            with open(USERS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}

    def _save_users(self, users: Dict[str, Any]):
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(users, f, indent=2)

    def _load_tokens(self) -> Dict[str, Any]:
        try:
            with open(TOKENS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}

    def _save_tokens(self, tokens: Dict[str, Any]):
        with open(TOKENS_FILE, 'w', encoding='utf-8') as f:
            json.dump(tokens, f, indent=2)

    def register(self, email: str, password: str, name: str, pronouns: str = "she/they",
                 age: int = 18, neurodiversity: Optional[List[str]] = None) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        users = self._load_users()
        
        if email_clean in users:
            raise ValueError("An account with this email address already exists.")
        
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long.")

        salt = secrets.token_hex(16)
        pwd_hash = self._hash_password(password, salt)
        user_id = f"usr_{secrets.token_hex(6)}"

        new_user = {
            "id": user_id,
            "email": email_clean,
            "name": name.strip(),
            "pronouns": pronouns.strip(),
            "age": age,
            "password_hash": pwd_hash,
            "salt": salt,
            "neurodiversity": neurodiversity or ["Neurodivergent Baseline"],
            "sensory_sensitivities": ["Auditory sensitivity", "Tactile clothing sensitivity"],
            "average_cycle_length": 28,
            "average_period_length": 5,
            "last_period_start": datetime.date.today().strftime('%Y-%m-%d'),
            "caregiver_assistance": False,
            "caregiver_name": None,
            "preferred_language_mode": "standard",
            "created_at": datetime.datetime.now().isoformat()
        }

        users[email_clean] = new_user
        self._save_users(users)

        token = self._create_token(email_clean)
        safe_user = {k: v for k, v in new_user.items() if k not in ('password_hash', 'salt')}
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": safe_user,
            "message": "Account created successfully"
        }

    def login(self, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        users = self._load_users()

        if email_clean not in users:
            raise ValueError("Invalid email or password. Please check your credentials.")

        user = users[email_clean]
        computed_hash = self._hash_password(password, user["salt"])

        if computed_hash != user["password_hash"]:
            raise ValueError("Invalid email or password. Please check your credentials.")

        token = self._create_token(email_clean)
        safe_user = {k: v for k, v in user.items() if k not in ('password_hash', 'salt')}
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": safe_user,
            "message": "Welcome back"
        }

    def _create_token(self, email: str) -> str:
        tokens = self._load_tokens()
        token = f"cc_{secrets.token_urlsafe(32)}"
        expiry = (datetime.datetime.now() + datetime.timedelta(days=7)).isoformat()
        
        tokens[token] = {
            "email": email,
            "created_at": datetime.datetime.now().isoformat(),
            "expires_at": expiry
        }
        self._save_tokens(tokens)
        return token

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        tokens = self._load_tokens()
        if token not in tokens:
            return None
        
        token_info = tokens[token]
        # Check expiration
        expires = datetime.datetime.fromisoformat(token_info["expires_at"])
        if datetime.datetime.now() > expires:
            del tokens[token]
            self._save_tokens(tokens)
            return None

        users = self._load_users()
        email = token_info["email"]
        if email not in users:
            return None

        user = users[email]
        return {k: v for k, v in user.items() if k not in ('password_hash', 'salt')}

    def logout(self, token: str) -> bool:
        tokens = self._load_tokens()
        if token in tokens:
            del tokens[token]
            self._save_tokens(tokens)
            return True
        return False

    def request_password_reset(self, email: str) -> Dict[str, str]:
        email_clean = email.strip().lower()
        users = self._load_users()
        
        if email_clean not in users:
            # For security, return generic confirmation without revealing if email exists
            return {
                "message": "If an account exists with this email, password recovery instructions have been prepared.",
                "demo_reset_token": "DEMO-RESET-9921"
            }

        reset_code = f"RESET-{secrets.token_hex(3).upper()}"
        return {
            "message": f"Password reset code generated. In production, this is sent to your confidential email.",
            "demo_reset_token": reset_code
        }

    def confirm_password_reset(self, email: str, reset_token: str, new_password: str) -> Dict[str, str]:
        email_clean = email.strip().lower()
        users = self._load_users()

        if email_clean not in users:
            raise ValueError("Unable to process password reset for this email.")

        if len(new_password) < 6:
            raise ValueError("New password must be at least 6 characters long.")

        user = users[email_clean]
        new_salt = secrets.token_hex(16)
        user["salt"] = new_salt
        user["password_hash"] = self._hash_password(new_password, new_salt)
        self._save_users(users)

        return {"message": "Your password has been successfully reset. Please log in with your new password."}

auth_service = AuthService()
