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
    {"category": "pequeno-almoco", "name_pt": "Cafés", "name_en": "Coffees", "description_pt": "Abatanado, garoto, pingado, galão, meia de leite ou capuccino.", "description_en": "Abatanado, garoto, pingado, galão, meia de leite or cappuccino.", "price": "", "order": 1},
    {"category": "pequeno-almoco", "name_pt": "Chávena de Chá", "name_en": "Cup of Tea", "description_pt": "Pergunte pelas infusões do dia.", "description_en": "Ask about today's infusions.", "price": "", "order": 2},
    {"category": "pequeno-almoco", "name_pt": "Pastelaria e Bolos", "name_en": "Pastries & Cakes", "description_pt": "Vitrine variada, com doces e bolos caseiros.", "description_en": "A varied counter with homemade cakes and sweets.", "price": "", "order": 3},
    {"category": "pequeno-almoco", "name_pt": "Sumo Natural e Néctar", "name_en": "Fresh Juice & Nectar", "description_pt": "Laranja espremida na hora ou néctar.", "description_en": "Freshly squeezed orange or nectar.", "price": "", "order": 4},
    {"category": "pequeno-almoco", "name_pt": "Sandes Prontas", "name_en": "Ready-Made Sandwiches", "description_pt": "Em pão ou croissant, sempre frescas.", "description_en": "In bread or croissant, always fresh.", "price": "", "order": 5},
    {"category": "menu", "name_pt": "Pastel de Nata + Café", "name_en": "Pastel de Nata + Coffee", "description_pt": "", "description_en": "", "price": "", "order": 1},
    {"category": "menu", "name_pt": "Sandes + Sumo ou Néctar", "name_en": "Sandwich + Juice or Nectar", "description_pt": "", "description_en": "", "price": "", "order": 2},
    {"category": "menu", "name_pt": "Tosta de Queijo e Fiambre", "name_en": "Ham & Cheese Toastie", "description_pt": "", "description_en": "", "price": "", "order": 3},
    {"category": "almoco", "name_pt": "Prato do Dia", "name_en": "Dish of the Day", "description_pt": "Pergunte o que saiu hoje do fogão.", "description_en": "Ask what came off the stove today.", "price": "", "order": 1},
    {"category": "almoco", "name_pt": "Sopa + Principal", "name_en": "Soup + Main", "description_pt": "Sopa, prato principal e café ou bebida (taça de vinho ou imperial).", "description_en": "Soup, main dish and coffee or a drink (glass of wine or draught beer).", "price": "", "order": 2},
    {"category": "almoco", "name_pt": "Principal + Sobremesa", "name_en": "Main + Dessert", "description_pt": "Prato principal, sobremesa e café ou bebida (taça de vinho ou imperial).", "description_en": "Main dish, dessert and coffee or a drink (glass of wine or draught beer).", "price": "", "order": 3},
    {"category": "petiscos", "name_pt": "Conservas em Vidro", "name_en": "Jarred Conservas", "description_pt": "Azeitonas, pickles, tiborna, tremoço, queijo em azeite e orégãos, batata nova em vinagrete.", "description_en": "Olives, pickles, tiborna, lupin beans, cheese in olive oil with oregano, new potatoes in vinaigrette.", "price": "", "order": 1},
    {"category": "fritos", "name_pt": "Pastel de Bacalhau", "name_en": "Codfish Cake", "description_pt": "Caseiro.", "description_en": "Homemade.", "price": "", "order": 1},
    {"category": "fritos", "name_pt": "Croquete à Antiga", "name_en": "Old-Style Croquette", "description_pt": "Caseiro.", "description_en": "Homemade.", "price": "", "order": 2},
    {"category": "fritos", "name_pt": "Pimentos de Padrón Recheados", "name_en": "Stuffed Padrón Peppers", "description_pt": "Caseiros.", "description_en": "Homemade.", "price": "", "order": 3},
    {"category": "especialidades", "name_pt": "Camarão à Guilho", "name_en": "Garlic Prawns à Guilho", "description_pt": "Salteado em azeite, alho e um toque de piri-piri.", "description_en": "Sautéed in olive oil, garlic and a touch of piri-piri.", "price": "", "order": 1},
    {"category": "especialidades", "name_pt": "Moelas em Tomatada", "name_en": "Gizzards in Tomato Stew", "description_pt": "Estufadas devagarinho, à moda antiga.", "description_en": "Slow-stewed, the old-fashioned way.", "price": "", "order": 2},
    {"category": "frios", "name_pt": "Camarão Cozido", "name_en": "Boiled Prawns", "description_pt": "", "description_en": "", "price": "", "order": 1},
    {"category": "frios", "name_pt": "Cenouras à Algarvia", "name_en": "Carrots Algarve Style", "description_pt": "Com alho, coentros e vinagre.", "description_en": "With garlic, coriander and vinegar.", "price": "", "order": 2},
    {"category": "frios", "name_pt": "Salada de Polvo", "name_en": "Octopus Salad", "description_pt": "", "description_en": "", "price": "", "order": 3},
    {"category": "frios", "name_pt": "Sardinha em Escabeche", "name_en": "Marinated Sardines", "description_pt": "", "description_en": "", "price": "", "order": 4},
    {"category": "frios", "name_pt": "Salada de Grão com Bacalhau", "name_en": "Chickpea & Codfish Salad", "description_pt": "", "description_en": "", "price": "", "order": 5},
    {"category": "frios", "name_pt": "Salada de Batata", "name_en": "Potato Salad", "description_pt": "", "description_en": "", "price": "", "order": 6},
    {"category": "sandes", "name_pt": "Prego", "name_en": "Steak Sandwich (Prego)", "description_pt": "", "description_en": "", "price": "", "order": 1},
    {"category": "sandes", "name_pt": "Bitoque", "name_en": "Bitoque (Steak & Egg)", "description_pt": "", "description_en": "", "price": "", "order": 2},
    {"category": "sandes", "name_pt": "Tosta Mista", "name_en": "Ham & Cheese Toast", "description_pt": "", "description_en": "", "price": "", "order": 3},
    {"category": "sandes", "name_pt": "Tosta Aberta de Atum Picante", "name_en": "Open Spicy Tuna Toast", "description_pt": "", "description_en": "", "price": "", "order": 4},
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
