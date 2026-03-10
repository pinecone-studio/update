# EBMS — Багийн Setup (10 хүн)

Бүх гишүүд доорх 4 алхамыг дагана. Wrangler global суулгах шаардлагагүй.

---

## 1. Repo татах

```bash
git clone https://github.com/pinecone-studio/team-7.git
cd team-7
```

---

## 2. Dependencies суулгах

```bash
npm install
```

---

## 3. Cloudflare нэвтрэх (нэг удаа)

```bash
npm run login
```

→ Браузер нээгдэнэ. Cloudflare account-аа зөвшөөрнө.

---

## 4. Migration ажиллуулах (нэг хүн хангалттай)

D1 хүснэгтүүд үүсгэх (өмнө хийгээгүй бол):

```bash
npm run db:migrate
```

---

## 5. Local ажиллуулах

```bash
# Worker (API)
npm run dev:worker

# Эсвэл Web (frontend)
npm run dev:web
```

---

## Товч команд

| Команд | Юу хийнэ |
|--------|----------|
| `npm run login` | Cloudflare нэвтрэх |
| `npm run db:migrate` | D1 migration (remote) |
| `npm run dev:worker` | Worker local |
| `npm run dev:web` | Next.js local |

---

## Шаардлага

- Node.js 20+
- npm (эсвэл pnpm)
- Cloudflare account (нэг багийн account хуваалцаж болно)
