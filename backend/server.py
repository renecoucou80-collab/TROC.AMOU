from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import shutil
import cloudinary
import cloudinary.uploader

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

# Cloudinary configuration
cloudinary.config(
    cloud_name="dlxfxswhy",
    api_key="948525558273959",
    api_secret="Zm3lGmRnkf0txxW6x8wwyVfBNpI"
)

# Create uploads directory (kept for backward compatibility but not used)
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class AdminLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class Donation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str
    postal_code: Optional[str] = None
    photos: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Sale(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    phone: str
    postal_code: Optional[str] = None
    description: str
    price: float
    photos: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Tip(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TipCreate(BaseModel):
    title: str
    category: str
    content: str

# Authentication helpers
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@api_router.post("/admin/login", response_model=Token)
async def admin_login(credentials: AdminLogin):
    # Simple admin credentials (in production, store hashed password in DB)
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    if credentials.username != ADMIN_USERNAME or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": credentials.username})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/donations")
async def create_donation(phone: str = Form(...), postal_code: str = Form(...), files: List[UploadFile] = File(None)):
    if len(files or []) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 photos allowed")
    
    photo_paths = []
    if files:
        for file in files:
            if file.filename:
                # Upload to Cloudinary
                try:
                    upload_result = cloudinary.uploader.upload(
                        file.file,
                        folder="partage-solidaire/donations",
                        resource_type="auto"
                    )
                    photo_paths.append(upload_result['secure_url'])
                except Exception as e:
                    logger.error(f"Error uploading to Cloudinary: {e}")
                    raise HTTPException(status_code=500, detail="Error uploading image")
    
    donation = Donation(phone=phone, postal_code=postal_code, photos=photo_paths)
    doc = donation.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.donations.insert_one(doc)
    return donation

@api_router.get("/donations", response_model=List[Donation])
async def get_donations():
    donations = await db.donations.find({}, {"_id": 0}).to_list(1000)
    for donation in donations:
        if isinstance(donation['created_at'], str):
            donation['created_at'] = datetime.fromisoformat(donation['created_at'])
    return donations

@api_router.delete("/donations/{donation_id}")
async def delete_donation(donation_id: str, admin: str = Depends(get_current_admin)):
    result = await db.donations.delete_one({"id": donation_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Donation not found")
    return {"message": "Donation deleted successfully"}

@api_router.post("/sales")
async def create_sale(
    phone: str = Form(...),
    postal_code: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    files: List[UploadFile] = File(None)
):
    if len(files or []) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 photos allowed")
    
    photo_paths = []
    if files:
        for file in files:
            if file.filename:
                # Upload to Cloudinary
                try:
                    upload_result = cloudinary.uploader.upload(
                        file.file,
                        folder="partage-solidaire/sales",
                        resource_type="auto"
                    )
                    photo_paths.append(upload_result['secure_url'])
                except Exception as e:
                    logger.error(f"Error uploading to Cloudinary: {e}")
                    raise HTTPException(status_code=500, detail="Error uploading image")
    
    sale = Sale(phone=phone, postal_code=postal_code, description=description, price=price, photos=photo_paths)
    doc = sale.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.sales.insert_one(doc)
    return sale

@api_router.get("/sales", response_model=List[Sale])
async def get_sales():
    sales = await db.sales.find({}, {"_id": 0}).to_list(1000)
    for sale in sales:
        if isinstance(sale['created_at'], str):
            sale['created_at'] = datetime.fromisoformat(sale['created_at'])
    return sales

@api_router.delete("/sales/{sale_id}")
async def delete_sale(sale_id: str, admin: str = Depends(get_current_admin)):
    result = await db.sales.delete_one({"id": sale_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Sale not found")
    return {"message": "Sale deleted successfully"}

@api_router.post("/tips", response_model=Tip)
async def create_tip(tip: TipCreate, _: str = Depends(get_current_admin)):
    tip_obj = Tip(**tip.model_dump())
    doc = tip_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.tips.insert_one(doc)
    return tip_obj

@api_router.get("/tips", response_model=List[Tip])
async def get_tips():
    tips = await db.tips.find({}, {"_id": 0}).to_list(1000)
    for tip in tips:
        if isinstance(tip['created_at'], str):
            tip['created_at'] = datetime.fromisoformat(tip['created_at'])
    return tips

@api_router.delete("/tips/{tip_id}")
async def delete_tip(tip_id: str, _: str = Depends(get_current_admin)):
    result = await db.tips.delete_one({"id": tip_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tip not found")
    return {"message": "Tip deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

# Mount uploads as static files under /api/uploads
app.mount("/api/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()