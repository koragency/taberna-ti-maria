# Publicar a Taberna Ti Maria GRÁTIS (Vercel + Render + MongoDB Atlas)

Guia passo a passo para alojar o site completo sem custos mensais:
- **Vercel** (grátis) → o site (frontend)
- **Render** (plano free) → o backend (login, ementa editável)
- **MongoDB Atlas** (plano M0 grátis) → a base de dados

Total: **0€/mês**. Única limitação: o Render free "adormece" após 15 min sem visitas — a primeira visita depois disso demora ~30 segundos a acordar. Depois é instantâneo.

---

## Passo 0 — Exportar o código para o GitHub

1. No Emergent, clique em **Save → Save to GitHub** e exporte este projeto para um repositório seu (ex: `taberna-ti-maria`).
2. Tudo o que precisa já está preparado no repositório: `frontend/vercel.json`, `render.yaml`, `backend/runtime.txt`.

---

## Passo 1 — Base de dados grátis (MongoDB Atlas)

1. Crie conta em https://cloud.mongodb.com (grátis, sem cartão).
2. **Create Cluster** → escolha o tier **M0 Free** → região mais próxima (ex: Frankfurt/Ireland).
3. **Database Access** → **Add Database User**: crie um utilizador com password (guarde-a). Ex: user `timaria`, password forte sua.
4. **Network Access** → **Add IP Address** → escolha **Allow Access from Anywhere** (`0.0.0.0/0`). (Necessário porque o Render usa IPs dinâmicos.)
5. Volte ao cluster → **Connect → Drivers → Node.js/Python** → copie a *connection string*, que tem este formato:
   ```
   mongodb+srv://timaria:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Substitua `<password>` pela password do passo 3. **Guarde esta string** — é o seu `MONGO_URL`.

---

## Passo 2 — Backend grátis (Render)

1. Crie conta em https://render.com (grátis, pode entrar com GitHub).
2. **New → Web Service** → ligue o repositório `taberna-ti-maria`.
3. Configure:
   - **Root Directory**: `backend`
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**
4. Em **Environment Variables**, adicione:
   | Chave | Valor |
   |---|---|
   | `MONGO_URL` | a connection string do Atlas (Passo 1.6) |
   | `DB_NAME` | `timaria` |
   | `JWT_SECRET` | copie de `backend/.env` no repositório |
   | `ADMIN_EMAIL` | `tabernatimaria@gmail.com` |
   | `ADMIN_PASSWORD` | a password do painel (a que definiu) |
   | `FRONTEND_URL` | `https://COLOCAR-DEPOIS.vercel.app` (temporário — corrigimos no Passo 4) |
5. **Create Web Service**. O primeiro arranque demora 2-5 minutos.
6. Quando ficar "Live", anote o URL: `https://taberna-ti-maria-api.onrender.com`
7. Teste: abra `https://SEU-URL.onrender.com/api/menu` no browser — deve listar os 99 itens da ementa (o backend semeia automaticamente o admin e a ementa completa no primeiro arranque).

> Alternativa rápida: **New → Blueprint** e aponte ao repositório — o ficheiro `render.yaml` já traz toda esta configuração; só precisa de preencher os valores marcados `sync: false`.

---

## Passo 3 — Frontend grátis (Vercel)

1. Crie conta em https://vercel.com (grátis, pode entrar com GitHub).
2. **Add New → Project** → importe `taberna-ti-maria`.
3. Configure:
   - **Root Directory**: `frontend` (clique em Edit)
   - Framework: deteta automaticamente (Create React App)
   - Build/Output: já vêm do `vercel.json`, não mexa
4. Em **Environment Variables**, adicione:
   | Chave | Valor |
   |---|---|
   | `REACT_APP_BACKEND_URL` | `https://taberna-ti-maria-api.onrender.com` (o URL do Passo 2.6, **sem** `/` no fim) |
5. **Deploy**. Em ~2 minutos tem o site no ar: `https://seu-projeto.vercel.app`

---

## Passo 4 — Ligar os dois (CORS)

1. Volte ao Render → o seu serviço → **Environment**.
2. Edite `FRONTEND_URL` para o URL real da Vercel: `https://seu-projeto.vercel.app` (**sem** `/` no fim).
3. **Save Changes** — o Render reinicia sozinho (~1 min).

**Pronto!** Abra o site da Vercel, desça até à ementa (deve carregar o livro) e entre em `/admin` com o seu email e password para confirmar que a edição funciona.

---

## Notas importantes

- **Domínio próprio**: se comprar `tabernatimaria.pt`, liga-se grátis na Vercel (Settings → Domains). Depois atualize o `FRONTEND_URL` no Render para o domínio novo.
- **Atualizar o site no futuro**: faça as alterações no Emergent → **Save to GitHub** → Vercel e Render fazem redeploy automáticos.
- **Ementa**: editada sempre em `/admin` no site ao vivo — grava diretamente na base de dados, sem redeploys.
- **Cold start**: se o site ficar ~15 min sem visitas, a primeira abertura demora até ~30s (a ementa aparece logo que o backend acorda). É a única contrapartida do plano grátis.
- **Limites do grátis**: Render free = 750h/mês (chega para 1 serviço sempre on); Atlas M0 = 512MB (a ementa ocupa <1MB); Vercel free = 100GB de tráfego/mês (o site com vídeo gasta ~20MB por visita completa — dá para ~5000 visitas/mês).
- **Emergent**: depois de estar tudo a funcionar na Vercel, pode parar de publicar no Emergent. Mantenha o projeto (e o Save to GitHub) para futuras edições.
