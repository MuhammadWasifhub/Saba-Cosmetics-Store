# Saba Cosmetics — Setup Guide (Step by Step)

Pura process free hai. Sirf domain buy karna hoga (~$8-12/year) agar apna custom domain
chahiye — warna Cloudflare ka free `.pages.dev` subdomain bilkul free milta hai.

---

## STEP 1 — Zip extract karo aur VS Code mein kholo

1. `saba-cosmetics.zip` ko kahin bhi extract karo (Desktop pe folder bana lo)
2. VS Code kholo → File → Open Folder → `saba-cosmetics` folder select karo
3. VS Code ka built-in terminal kholo: `Terminal` menu → `New Terminal`

---

## STEP 2 — Node.js install karo (agar nahi hai)

Terminal mein check karo:
```
node -v
```
Agar error aaye, [nodejs.org](https://nodejs.org) se LTS version install karlo (free).

---

## STEP 3 — Dependencies install karo

VS Code terminal mein:
```
npm install
```
Ye 1-2 minute lega.

---

## STEP 4 — Supabase setup (Database + Storage)

Tumhara Supabase account already hai, to:

1. [supabase.com/dashboard](https://supabase.com/dashboard) pe jao → **New Project** banao
   (agar already ek project hai to wahi use kar sakte ho)
2. Project bante hi, left sidebar mein **SQL Editor** pe jao
3. `supabase/schema.sql` file (isi project ke andar hai) ko VS Code mein kholo
4. Uska **poora content copy karo**
5. Supabase SQL Editor mein paste karo → **Run** button dabao
   - Ye automatically: products table, orders table, security rules, aur image storage bucket sab bana dega
   - 3 sample products bhi add ho jayengi (test karne ke liye — baad mein admin se delete kar sakte ho)

### Keys nikalna (API keys kahan se milti hain):

1. Supabase dashboard mein **Project Settings** (gear icon, left bottom) → **API**
2. Yahan 3 cheezein milengi:
   - **Project URL** → ye `NEXT_PUBLIC_SUPABASE_URL` hai
   - **anon / public key** → ye `NEXT_PUBLIC_SUPABASE_ANON_KEY` hai
   - **service_role key** (⚠️ secret, "Reveal" pe click karo) → ye `SUPABASE_SERVICE_ROLE_KEY` hai

---

## STEP 5 — .env.local file banao

1. VS Code mein `.env.example` file ko copy karke naam do `.env.local`
   (terminal mein: `cp .env.example .env.local` — Mac/Linux, ya Windows mein manually copy-paste-rename karo)

2. `.env.local` kholo aur fill karo:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

ADMIN_PASSWORD=apna-koi-bhi-strong-password
ADMIN_SESSION_SECRET=koi-bhi-lambi-random-string-yahan-daal-do-jaise-xk29Fj2kLp9Qz

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **ADMIN_PASSWORD**: Ye wo password hai jo tum `/admin` pe login karne ke liye use karoge.
> **ADMIN_SESSION_SECRET**: Koi bhi random lambi string daal do (jaise keyboard pe random type kardo) — ye sirf security ke liye hai, kahin use nahi hoga.

---

## STEP 6 — Local pe test karo

```
npm run dev
```

Browser mein kholo: **http://localhost:3000** → tumhari store dikhegi
Admin panel: **http://localhost:3000/admin** → wahan `ADMIN_PASSWORD` se login karo

Yahan se products add karlo, order test karlo — sab locally kaam karega.

---

## STEP 7 — Cloudflare Pages pe deploy karo (FREE)

Tumhara Cloudflare account already hai.

### GitHub ke through (recommended — future updates easy rahenge):

1. Is project ko GitHub pe push karo:
```
git init
git add .
git commit -m "Saba Cosmetics store"
```
GitHub pe naya repo banao (github.com → New Repository), phir:
```
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Apna GitHub repo select karo
4. Build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
5. **Environment Variables** section mein — apni `.env.local` ki saari values yahan bhi add karo
   (same names: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.)
   - `NEXT_PUBLIC_SITE_URL` ko apne final Cloudflare URL se update karo (jaise `https://saba-cosmetics.pages.dev`)
6. **Save and Deploy** dabao

2-3 minute mein live ho jayega, free `.pages.dev` link milega.

### Custom domain add karna (optional):

Cloudflare Pages → tumhare project → **Custom domains** → apna domain add karo
(agar domain Cloudflare se hi kharida hai to automatic setup hojayega, warna DNS records manually add karni hogi — Cloudflare khud guide karega).

---

## Roz ka use — kya karna hoga

- **Product add/remove/edit**: `/admin` pe login karke → Products tab → sab kuch wahan se, Supabase kabhi khol na ke zaroorat nahi
- **Orders dekhna**: `/admin` → Orders tab → customer details, address, items sab milega, status update kar sakte ho (Pending → Confirmed → Shipped → Delivered)
- **Customer side**: koi bhi apna domain/link khol kar products browse karega, "Add to bag" karega, phir "Bag" button se checkout karega, address bharega, order place karega (Cash on Delivery)

---

## Sab free hai?

| Service | Free tier limit | Tumhare liye kaafi hai? |
|---|---|---|
| Cloudflare Pages | Unlimited requests, 500 builds/month | ✅ Haan |
| Supabase | 500MB database, 1GB storage, 50k monthly active users | ✅ Haan, shuru mein bohot zyada hai |
| Domain (optional) | N/A | ~$10/year agar custom domain chahiye |

Store bina custom domain ke bhi bilkul free chalegi (`.pages.dev` link se).
