from dotenv import load_dotenv
load_dotenv()

import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from starlette.middleware.cors import CORSMiddleware

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
api_router = APIRouter(prefix="/api")


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=30), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie(key="access_token", value=access, httponly=True, secure=True, samesite="none", max_age=1800, path="/")
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class LoginInput(BaseModel):
    email: str
    password: str


class MenuItemCreate(BaseModel):
    category: str
    name_pt: str
    name_en: str
    description_pt: str = ""
    description_en: str = ""
    price: str = ""
    available: bool = True
    order: int = 0


class MenuItemUpdate(BaseModel):
    category: Optional[str] = None
    name_pt: Optional[str] = None
    name_en: Optional[str] = None
    description_pt: Optional[str] = None
    description_en: Optional[str] = None
    price: Optional[str] = None
    available: Optional[bool] = None
    order: Optional[int] = None


MENU_SEED = [
    {"category": "petiscos", "name_pt": "Sardinhas Assadas na Brasa", "name_en": "Charcoal-Grilled Sardines", "description_pt": "No pão, com sal grosso e pimentos assados — como manda a tradição de Lagos.", "description_en": "On bread, with coarse salt and roasted peppers — the Lagos way.", "price": "8,50€", "order": 1},
    {"category": "petiscos", "name_pt": "Petinga Frita com Limão do Barrocal", "name_en": "Fried Baby Sardines with Barrocal Lemon", "description_pt": "Crocantes, pequeninas e perigosamente viciantes.", "description_en": "Crispy, tiny and dangerously addictive.", "price": "7,00€", "order": 2},
    {"category": "petiscos", "name_pt": "Conquilhas à Bulhão Pato", "name_en": "Wedge Clams à Bulhão Pato", "description_pt": "Alho, coentros e azeite algarvio. O pão é para molhar, sem vergonha.", "description_en": "Garlic, coriander and Algarve olive oil. Bread is for dipping, no shame.", "price": "9,50€", "order": 3},
    {"category": "petiscos", "name_pt": "Xerém de Conquilhas da Ria Formosa", "name_en": "Ria Formosa Clam Xerém", "description_pt": "O prato de comforto algarvio, cremoso e cheio de mar.", "description_en": "The Algarve's comfort dish — creamy cornmeal full of the sea.", "price": "10,00€", "order": 4},
    {"category": "petiscos", "name_pt": "Caracóis à Algarvia", "name_en": "Snails Algarve Style", "description_pt": "Com orégãos do cerro e uma cerveja gelada ao lado, de preferência.", "description_en": "With wild oregano from the hills — best with a cold beer alongside.", "price": "6,50€", "order": 5},
    {"category": "petiscos", "name_pt": "Queijo de Cabra do Barrocal", "name_en": "Barrocal Goat Cheese", "description_pt": "Com mel de rosmaninho e amêndoa torrada da casa.", "description_en": "With rosemary honey and our own toasted almonds.", "price": "6,00€", "order": 6},
    {"category": "petiscos", "name_pt": "Choco Frito com Aioli de Coentros", "name_en": "Fried Cuttlefish with Coriander Aioli", "description_pt": "Setubalense de nascença, algarvio de adoção — e de coração.", "description_en": "A coastal classic, adopted and perfected the Algarve way.", "price": "8,00€", "order": 7},
    {"category": "petiscos", "name_pt": "Amêijoas na Cataplana (p/ 2)", "name_en": "Clams in Cataplana (for 2)", "description_pt": "O barulho da cataplana a abrir é a nossa música favorita.", "description_en": "The sound of the cataplana opening is our favourite music.", "price": "22,00€", "order": 8},
    {"category": "vinhos", "name_pt": "Arvad Negra Mole Tinto", "name_en": "Arvad Negra Mole Red", "description_pt": "A casta mais antiga do Algarve, leve e elegante.", "description_en": "The Algarve's oldest grape — light and elegant.", "price": "4,50€ / 18€", "order": 1},
    {"category": "vinhos", "name_pt": "Morgado do Quintão Clarete", "name_en": "Morgado do Quintão Clarete", "description_pt": "Clarete fresco de vinhas velhas, para tardes que pedem calma.", "description_en": "Fresh clarete from old vines, for afternoons that ask for calm.", "price": "5,00€ / 20€", "order": 2},
    {"category": "vinhos", "name_pt": "Quinta dos Vales Grace Vineyard Branco", "name_en": "Quinta dos Vales Grace Vineyard White", "description_pt": "Branco mineral que nasce a poucos quilómetros daqui.", "description_en": "Mineral white born just a few kilometres from here.", "price": "5,50€ / 22€", "order": 3},
    {"category": "vinhos", "name_pt": "Cabrita Reserva Branco", "name_en": "Cabrita Reserva White", "description_pt": "Síria e arinto de São Bartolomeu de Messines.", "description_en": "Síria and Arinto from São Bartolomeu de Messines.", "price": "4,00€ / 16€", "order": 4},
    {"category": "vinhos", "name_pt": "João Clara Moscatel", "name_en": "João Clara Moscatel", "description_pt": "Para o fim da noite, com amêndoa e figo. Ou sem nada.", "description_en": "For the end of the night, with almonds and figs. Or nothing at all.", "price": "4,00€", "order": 5},
    {"category": "cervejas", "name_pt": "Dos Corvos IPA (Portimão)", "name_en": "Dos Corvos IPA (Portimão)", "description_pt": "Artesanal algarvia, lupulada e sem medo.", "description_en": "Algarve craft beer — hoppy and fearless.", "price": "4,50€", "order": 1},
    {"category": "cervejas", "name_pt": "Dos Corvos Stout", "name_en": "Dos Corvos Stout", "description_pt": "Escura como a noite de inverno no cais.", "description_en": "Dark as a winter night on the quay.", "price": "4,50€", "order": 2},
    {"category": "cervejas", "name_pt": "Dos Corvos Weiss", "name_en": "Dos Corvos Weiss", "description_pt": "De trigo, leve, para acompanhar sardinhas.", "description_en": "Wheat beer, light, made to accompany sardines.", "price": "4,00€", "order": 3},
    {"category": "cervejas", "name_pt": "Imperial Fresquíssima", "name_en": "Ice-Cold Draught", "description_pt": "Copo de 20cl, colarinho certo, temperatura de fazer inveja.", "description_en": "20cl glass, perfect head, enviably cold.", "price": "1,50€", "order": 4},
    {"category": "cervejas", "name_pt": "Caneca da Casa 50cl", "name_en": "House Mug 50cl", "description_pt": "Para quem tem sede a sério e conversa comprida.", "description_en": "For the truly thirsty and the long conversations.", "price": "3,50€", "order": 5},
]


@api_router.get("/")
async def root():
    return {"message": "Taberna Ti Maria API"}


@api_router.get("/menu")
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).sort("order", 1).to_list(500)
    return items


@api_router.post("/menu", status_code=201)
async def create_menu_item(item: MenuItemCreate, user: dict = Depends(get_current_user)):
    doc = item.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.menu_items.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/menu/{item_id}")
async def update_menu_item(item_id: str, update: MenuItemUpdate, user: dict = Depends(get_current_user)):
    data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="Nothing to update")
    result = await db.menu_items.update_one({"id": item_id}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    doc = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/menu/{item_id}", status_code=204)
async def delete_menu_item(item_id: str, user: dict = Depends(get_current_user)):
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return Response(status_code=204)


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts and attempts.get("attempts", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and locked_until.tzinfo is None:
            locked_until = locked_until.replace(tzinfo=timezone.utc)
        if locked_until and locked_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Demasiadas tentativas. Tente novamente em 15 minutos.")
        await db.login_attempts.delete_one({"identifier": identifier})
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"attempts": 1}, "$set": {"locked_until": datetime.now(timezone.utc) + timedelta(minutes=15)}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Email ou palavra-passe incorretos")
    await db.login_attempts.delete_one({"identifier": identifier})
    access = create_access_token(str(user["_id"]), email)
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    return {"email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out"}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return {"email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}


@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access = create_access_token(str(user["_id"]), user["email"])
    response.set_cookie(key="access_token", value=access, httponly=True, secure=True, samesite="none", max_age=1800, path="/")
    return {"message": "refreshed"}


app.include_router(api_router)

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Sr. Ângelo",
            "role": "admin",
            "created_at": datetime.now(timezone.utc),
        })
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated from .env")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    count = await db.menu_items.count_documents({})
    if count == 0:
        now = datetime.now(timezone.utc).isoformat()
        docs = [{**item, "id": str(uuid.uuid4()), "available": True, "created_at": now} for item in MENU_SEED]
        await db.menu_items.insert_many(docs)
        logger.info("Menu seeded with %d items", len(docs))


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
