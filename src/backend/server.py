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
    highlight: bool = False
    order: int = 0


class MenuItemUpdate(BaseModel):
    category: Optional[str] = None
    name_pt: Optional[str] = None
    name_en: Optional[str] = None
    description_pt: Optional[str] = None
    description_en: Optional[str] = None
    price: Optional[str] = None
    available: Optional[bool] = None
    highlight: Optional[bool] = None
    order: Optional[int] = None


MENU_SEED = [
    {"category": "cafes", "name_pt": "Café", "name_en": "Coffee", "description_pt": "", "description_en": "", "price": "1,00€", "order": 1},
    {"category": "cafes", "name_pt": "Abatanado", "name_en": "Abatanado", "description_pt": "", "description_en": "", "price": "1,50€", "order": 2},
    {"category": "cafes", "name_pt": "Duplo", "name_en": "Double Espresso", "description_pt": "", "description_en": "", "price": "2,00€", "order": 3},
    {"category": "cafes", "name_pt": "Galão", "name_en": "Galão", "description_pt": "", "description_en": "", "price": "1,80€", "order": 4},
    {"category": "cafes", "name_pt": "Meia de Leite", "name_en": "Meia de Leite", "description_pt": "", "description_en": "", "price": "1,80€", "order": 5},
    {"category": "cafes", "name_pt": "Garoto", "name_en": "Garoto", "description_pt": "", "description_en": "", "price": "1,20€", "order": 6},
    {"category": "cafes", "name_pt": "Americano", "name_en": "Americano", "description_pt": "", "description_en": "", "price": "1,50€", "order": 7},
    {"category": "cafes", "name_pt": "Capuccino", "name_en": "Cappuccino", "description_pt": "", "description_en": "", "price": "2,50€", "order": 8},
    {"category": "cafes", "name_pt": "Café Descafeinado", "name_en": "Decaf Coffee", "description_pt": "", "description_en": "", "price": "1,30€", "order": 9},
    {"category": "cafes", "name_pt": "Galão Descafeinado", "name_en": "Decaf Galão", "description_pt": "", "description_en": "", "price": "2,10€", "order": 10},
    {"category": "pequeno-almoco", "name_pt": "Bolo (Fatia)", "name_en": "Cake (Slice)", "description_pt": "", "description_en": "", "price": "1,50€", "order": 1},
    {"category": "pequeno-almoco", "name_pt": "Pão de Queijo", "name_en": "Cheese Bread", "description_pt": "", "description_en": "", "price": "2,00€", "order": 2},
    {"category": "pequeno-almoco", "name_pt": "Pastel de Nata", "name_en": "Pastel de Nata", "description_pt": "", "description_en": "", "price": "1,20€", "order": 3, "highlight": True},
    {"category": "pequeno-almoco", "name_pt": "Croissant", "name_en": "Croissant", "description_pt": "", "description_en": "", "price": "1,50€", "order": 4},
    {"category": "pequeno-almoco", "name_pt": "Tosta com Manteiga", "name_en": "Buttered Toast", "description_pt": "", "description_en": "", "price": "1,80€", "order": 5},
    {"category": "pequeno-almoco", "name_pt": "Tosta Mista", "name_en": "Ham & Cheese Toastie", "description_pt": "", "description_en": "", "price": "3,20€", "order": 6},
    {"category": "pequeno-almoco", "name_pt": "Tosta Mista em Pão Rústico", "name_en": "Ham & Cheese Toastie on Rustic Bread", "description_pt": "", "description_en": "", "price": "4,00€", "order": 7},
    {"category": "pequeno-almoco", "name_pt": "Croissant Misto com Manteiga", "name_en": "Ham & Cheese Croissant with Butter", "description_pt": "", "description_en": "", "price": "3,00€", "order": 8},
    {"category": "pequeno-almoco", "name_pt": "Sandes de Omelete Simples", "name_en": "Plain Omelette Sandwich", "description_pt": "", "description_en": "", "price": "3,50€", "order": 9},
    {"category": "pequeno-almoco", "name_pt": "Sandes de Omelete Mista", "name_en": "Ham & Cheese Omelette Sandwich", "description_pt": "Queijo e fiambre.", "description_en": "Ham and cheese.", "price": "4,50€", "order": 10},
    {"category": "pequeno-almoco", "name_pt": "Ovos Mexidos e Torradas", "name_en": "Scrambled Eggs & Toast", "description_pt": "", "description_en": "", "price": "6,00€", "order": 11},
    {"category": "pequeno-almoco", "name_pt": "Ovos Mexidos, Bacon e Torradas", "name_en": "Scrambled Eggs, Bacon & Toast", "description_pt": "", "description_en": "", "price": "7,50€", "order": 12},
    {"category": "pequeno-almoco", "name_pt": "Tosta Aberta de Atum Picante e Limão", "name_en": "Open Spicy Tuna & Lemon Toast", "description_pt": "", "description_en": "", "price": "8,00€", "order": 13, "highlight": True},
    {"category": "pratos", "name_pt": "Sopa", "name_en": "Soup", "description_pt": "", "description_en": "", "price": "3,50€", "order": 1},
    {"category": "pratos", "name_pt": "Salada", "name_en": "Salad", "description_pt": "", "description_en": "", "price": "4,00€", "order": 2},
    {"category": "pratos", "name_pt": "Salada Grande", "name_en": "Large Salad", "description_pt": "", "description_en": "", "price": "7,00€", "order": 3},
    {"category": "pratos", "name_pt": "Pão", "name_en": "Bread", "description_pt": "", "description_en": "", "price": "1,50€", "order": 4},
    {"category": "pratos", "name_pt": "Porção de Batatas Fritas", "name_en": "French Fries (Portion)", "description_pt": "", "description_en": "", "price": "3,50€", "order": 5},
    {"category": "pratos", "name_pt": "Batata em Conserva", "name_en": "Pickled Potato", "description_pt": "", "description_en": "", "price": "2,00€", "order": 6},
    {"category": "pratos", "name_pt": "Sardinha em Escabeche", "name_en": "Marinated Sardines", "description_pt": "", "description_en": "", "price": "5,00€", "order": 7, "highlight": True},
    {"category": "pratos", "name_pt": "Camarão", "name_en": "Prawns", "description_pt": "", "description_en": "", "price": "5,00€", "order": 8, "highlight": True},
    {"category": "pratos", "name_pt": "Moela", "name_en": "Gizzards", "description_pt": "", "description_en": "", "price": "4,00€", "order": 9},
    {"category": "pratos", "name_pt": "Bifana à Ti Maria", "name_en": "Bifana Ti Maria Style", "description_pt": "A nossa assinatura.", "description_en": "Our signature.", "price": "5,00€", "order": 10, "highlight": True},
    {"category": "pratos", "name_pt": "Prego de Frango", "name_en": "Chicken Steak Sandwich", "description_pt": "", "description_en": "", "price": "6,00€", "order": 11},
    {"category": "pratos", "name_pt": "Prego de Vaca", "name_en": "Beef Steak Sandwich", "description_pt": "", "description_en": "", "price": "7,50€", "order": 12},
    {"category": "pratos", "name_pt": "Bitoque de Vaca no Prato", "name_en": "Beef Bitoque (Steak, Egg & Fries)", "description_pt": "", "description_en": "", "price": "16,00€", "order": 13},
    {"category": "pratos", "name_pt": "Bitoque de Frango no Prato", "name_en": "Chicken Bitoque", "description_pt": "", "description_en": "", "price": "13,00€", "order": 14},
    {"category": "pratos", "name_pt": "Filé de Dourada", "name_en": "Sea Bream Fillet", "description_pt": "", "description_en": "", "price": "14,00€", "order": 15},
    {"category": "pratos", "name_pt": "Filé de Vazia", "name_en": "Beef Tenderloin Fillet", "description_pt": "", "description_en": "", "price": "20,00€", "order": 16},
    {"category": "pratos", "name_pt": "Prato do Dia", "name_en": "Dish of the Day", "description_pt": "Pergunte o que saiu hoje do fogão.", "description_en": "Ask what came off the stove today.", "price": "13,00€", "order": 17, "highlight": True},
    {"category": "pratos", "name_pt": "Menu do Dia", "name_en": "Daily Menu", "description_pt": "", "description_en": "", "price": "18,00€", "order": 18},
    {"category": "pratos", "name_pt": "Menu", "name_en": "Set Menu", "description_pt": "", "description_en": "", "price": "15,00€", "order": 19},
    {"category": "sobremesas", "name_pt": "Doce", "name_en": "Sweet of the Day", "description_pt": "", "description_en": "", "price": "4,00€", "order": 1},
    {"category": "sobremesas", "name_pt": "Mousse", "name_en": "Mousse", "description_pt": "", "description_en": "", "price": "3,50€", "order": 2},
    {"category": "sobremesas", "name_pt": "Pudim", "name_en": "Flan Pudding", "description_pt": "", "description_en": "", "price": "3,50€", "order": 3},
    {"category": "gelados", "name_pt": "Creme Catalão", "name_en": "Crème Catalane Ice Cream", "description_pt": "", "description_en": "", "price": "4,50€", "order": 1},
    {"category": "gelados", "name_pt": "Vianeta", "name_en": "Vianeta", "description_pt": "", "description_en": "", "price": "3,50€", "order": 2},
    {"category": "gelados", "name_pt": "Romântic", "name_en": "Romântic", "description_pt": "", "description_en": "", "price": "4,00€", "order": 3},
    {"category": "gelados", "name_pt": "Bomboniera", "name_en": "Bomboniera", "description_pt": "", "description_en": "", "price": "3,50€", "order": 4},
    {"category": "gelados", "name_pt": "Patrulha Pata", "name_en": "PAW Patrol Ice Cream", "description_pt": "", "description_en": "", "price": "3,50€", "order": 5},
    {"category": "bebidas", "name_pt": "Imperial", "name_en": "Draught Beer (20cl)", "description_pt": "", "description_en": "", "price": "1,70€", "order": 1},
    {"category": "bebidas", "name_pt": "Caneca", "name_en": "Beer Mug (50cl)", "description_pt": "", "description_en": "", "price": "3,00€", "order": 2},
    {"category": "bebidas", "name_pt": "Super Bock Mini", "name_en": "Super Bock Mini", "description_pt": "", "description_en": "", "price": "1,50€", "order": 3},
    {"category": "bebidas", "name_pt": "Cerveja sem Álcool", "name_en": "Alcohol-Free Beer", "description_pt": "", "description_en": "", "price": "2,20€", "order": 4},
    {"category": "bebidas", "name_pt": "Somersby", "name_en": "Somersby Cider", "description_pt": "", "description_en": "", "price": "2,50€", "order": 5},
    {"category": "bebidas", "name_pt": "Coca-Cola / Zero", "name_en": "Coca-Cola / Zero", "description_pt": "", "description_en": "", "price": "2,70€", "order": 6},
    {"category": "bebidas", "name_pt": "Ice Tea", "name_en": "Ice Tea", "description_pt": "", "description_en": "", "price": "2,60€", "order": 7},
    {"category": "bebidas", "name_pt": "Compal", "name_en": "Compal Juice", "description_pt": "", "description_en": "", "price": "2,60€", "order": 8},
    {"category": "bebidas", "name_pt": "Sumol", "name_en": "Sumol", "description_pt": "", "description_en": "", "price": "2,60€", "order": 9},
    {"category": "bebidas", "name_pt": "Guaraná Antarctica", "name_en": "Guaraná Antarctica", "description_pt": "", "description_en": "", "price": "3,50€", "order": 10},
    {"category": "bebidas", "name_pt": "Água sem Gás", "name_en": "Still Water", "description_pt": "", "description_en": "", "price": "1,20€", "order": 11},
    {"category": "bebidas", "name_pt": "Água das Pedras", "name_en": "Sparkling Water", "description_pt": "", "description_en": "", "price": "2,10€", "order": 12},
    {"category": "bebidas", "name_pt": "Água das Pedras Limão", "name_en": "Sparkling Water with Lemon", "description_pt": "", "description_en": "", "price": "2,40€", "order": 13},
    {"category": "bebidas", "name_pt": "Tónica", "name_en": "Tonic Water", "description_pt": "", "description_en": "", "price": "2,30€", "order": 14},
    {"category": "bebidas", "name_pt": "Sumo de Laranja Natural Pequeno", "name_en": "Fresh Orange Juice (S)", "description_pt": "", "description_en": "", "price": "3,00€", "order": 15},
    {"category": "bebidas", "name_pt": "Sumo de Laranja Natural Grande", "name_en": "Fresh Orange Juice (L)", "description_pt": "", "description_en": "", "price": "4,00€", "order": 16},
    {"category": "vinhos", "name_pt": "Taça de Vinho Tinto", "name_en": "Glass of Red Wine", "description_pt": "", "description_en": "", "price": "2,50€", "order": 1},
    {"category": "vinhos", "name_pt": "Taça de Vinho Branco", "name_en": "Glass of White Wine", "description_pt": "", "description_en": "", "price": "2,50€", "order": 2},
    {"category": "vinhos", "name_pt": "Taça de Vinho Rosé", "name_en": "Glass of Rosé Wine", "description_pt": "", "description_en": "", "price": "2,50€", "order": 3},
    {"category": "vinhos", "name_pt": "Taça de Branco de Pressão", "name_en": "Draught White Wine (Glass)", "description_pt": "", "description_en": "", "price": "2,50€", "order": 4},
    {"category": "vinhos", "name_pt": "1/2 Jarra de Branco de Pressão", "name_en": "Draught White Wine (Half Jug)", "description_pt": "", "description_en": "", "price": "6,00€", "order": 5},
    {"category": "vinhos", "name_pt": "Jarra de Branco de Pressão", "name_en": "Draught White Wine (Jug)", "description_pt": "", "description_en": "", "price": "10,00€", "order": 6},
    {"category": "vinhos", "name_pt": "Vinho 1 Tinto", "name_en": "House Red Nº1 (Bottle)", "description_pt": "", "description_en": "", "price": "10,00€", "order": 7},
    {"category": "vinhos", "name_pt": "Vinho 1 Branco", "name_en": "House White Nº1 (Bottle)", "description_pt": "", "description_en": "", "price": "10,00€", "order": 8},
    {"category": "vinhos", "name_pt": "Vinho 2 Tinto", "name_en": "House Red Nº2 (Bottle)", "description_pt": "", "description_en": "", "price": "8,00€", "order": 9},
    {"category": "vinhos", "name_pt": "Copo Pequeno de Vinho", "name_en": "Small Glass of Wine", "description_pt": "", "description_en": "", "price": "1,00€", "order": 10},
    {"category": "vinhos", "name_pt": "Sangria de Vinho Tinto 0,5L", "name_en": "Red Wine Sangria 0.5L", "description_pt": "", "description_en": "", "price": "8,00€", "order": 11, "highlight": True},
    {"category": "vinhos", "name_pt": "Sangria de Vinho Tinto 1L", "name_en": "Red Wine Sangria 1L", "description_pt": "", "description_en": "", "price": "18,00€", "order": 12},
    {"category": "vinhos", "name_pt": "Sangria de Vinho Branco 0,5L", "name_en": "White Wine Sangria 0.5L", "description_pt": "", "description_en": "", "price": "9,50€", "order": 13},
    {"category": "vinhos", "name_pt": "Sangria de Vinho Branco 1L", "name_en": "White Wine Sangria 1L", "description_pt": "", "description_en": "", "price": "18,00€", "order": 14},
    {"category": "vinhos", "name_pt": "Sangria de Espumante 0,5L", "name_en": "Sparkling Wine Sangria 0.5L", "description_pt": "", "description_en": "", "price": "12,00€", "order": 15},
    {"category": "vinhos", "name_pt": "Sangria de Espumante 1L", "name_en": "Sparkling Wine Sangria 1L", "description_pt": "", "description_en": "", "price": "22,00€", "order": 16},
    {"category": "doses", "name_pt": "Porto / Moscatel de Setúbal", "name_en": "Port / Moscatel de Setúbal", "description_pt": "", "description_en": "", "price": "3,00€", "order": 1},
    {"category": "doses", "name_pt": "Madeira (Dose)", "name_en": "Madeira Wine", "description_pt": "", "description_en": "", "price": "3,00€", "order": 2},
    {"category": "doses", "name_pt": "Licor Beirão", "name_en": "Licor Beirão", "description_pt": "", "description_en": "", "price": "3,00€", "order": 3, "highlight": True},
    {"category": "doses", "name_pt": "Ginjinha", "name_en": "Ginjinha (Cherry Liqueur)", "description_pt": "", "description_en": "", "price": "2,50€", "order": 4},
    {"category": "doses", "name_pt": "Amarguinha", "name_en": "Amarguinha (Almond Liqueur)", "description_pt": "O digestivo algarvio.", "description_en": "The Algarve's digestif.", "price": "3,00€", "order": 5, "highlight": True},
    {"category": "doses", "name_pt": "Aguardente Velha", "name_en": "Old Brandy", "description_pt": "", "description_en": "", "price": "4,50€", "order": 6},
    {"category": "doses", "name_pt": "Whisky JB Rare", "name_en": "Whisky JB Rare", "description_pt": "", "description_en": "", "price": "4,00€", "order": 7},
    {"category": "doses", "name_pt": "Vodka Smirnoff", "name_en": "Vodka Smirnoff", "description_pt": "", "description_en": "", "price": "3,00€", "order": 8},
    {"category": "doses", "name_pt": "Rum Havana 3 Anos", "name_en": "Havana 3-Year Rum", "description_pt": "", "description_en": "", "price": "3,50€", "order": 9},
    {"category": "doses", "name_pt": "Bagaço São Domingos", "name_en": "Bagaço São Domingos", "description_pt": "", "description_en": "", "price": "3,00€", "order": 10},
    {"category": "doses", "name_pt": "Cachaça 51", "name_en": "Cachaça 51", "description_pt": "", "description_en": "", "price": "3,00€", "order": 11},
    {"category": "doses", "name_pt": "Constantino", "name_en": "Constantino Brandy", "description_pt": "", "description_en": "", "price": "3,00€", "order": 12},
    {"category": "doses", "name_pt": "Gin", "name_en": "Gin", "description_pt": "", "description_en": "", "price": "4,00€", "order": 13},
    {"category": "doses", "name_pt": "Gin Tónica", "name_en": "Gin & Tonic", "description_pt": "", "description_en": "", "price": "6,50€", "order": 14},
    {"category": "doses", "name_pt": "Martini", "name_en": "Martini", "description_pt": "", "description_en": "", "price": "4,50€", "order": 15},
    {"category": "doses", "name_pt": "Caipirinha de Cachaça", "name_en": "Cachaça Caipirinha", "description_pt": "", "description_en": "", "price": "8,00€", "order": 16},
    {"category": "doses", "name_pt": "Caipirinha de Vodka", "name_en": "Vodka Caipirinha", "description_pt": "", "description_en": "", "price": "7,00€", "order": 17},
]


@api_router.get("/")
async def root():
    return {"message": "Taberna Ti Maria API"}


@api_router.get("/health")
async def health():
    return {"status": "ok"}


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
