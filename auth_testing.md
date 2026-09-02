# Auth Testing Playbook — Taberna Ti Maria

## Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, unique index on users.email, index on login_attempts.identifier.

## Step 2: API Testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"angelo@timaria.pt","password":"TiMaria1954!"}'
cat cookies.txt
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login returns the user object and sets `access_token` + `refresh_token` cookies. `/me` returns the same user using those cookies.

## Step 3: Admin menu CRUD
```
curl -b cookies.txt -X POST http://localhost:8001/api/menu -H "Content-Type: application/json" -d '{"category":"petiscos","name_pt":"Teste","name_en":"Test","price":"1,00€"}'
curl -b cookies.txt -X PUT http://localhost:8001/api/menu/<id> -H "Content-Type: application/json" -d '{"price":"2,00€"}'
curl -b cookies.txt -X DELETE http://localhost:8001/api/menu/<id>
```
Unauthenticated calls to POST/PUT/DELETE must return 401.
