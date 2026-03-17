# Локал dev — Backend + Frontend ажиллуулах

Шинэ backend (employee_contracts, vendor contracts) ашиглан локал дээр ажиллуулах алхмууд.

## 1. Өгөгдлийн сан (D1) — migration

Локал D1 дээр бүх хүснэгтүүд (`employee_contracts`, `employee_notifications` г.м) байх ёстой. Нэг удаа ажиллуулна:

```bash
# Repo root-оос
pnpm db:local:all
```

Эсвэл зөвхөн шинэ хүснэгтүүд:

```bash
cd apps/ebms-worker
pnpm run db:local:employee-notifications
pnpm run db:local:employee-contracts
pnpm run db:local:employee-contracts-employee-id
```

## 2. Frontend — API URL тохируулах

`apps/ebms-web` дотор `.env.local` үүсгэж (эсвэл `.env`), локал worker руу заана:

```bash
cd apps/ebms-web
cp .env.example .env.local
```

`.env.example`-д: `NEXT_PUBLIC_API_URL=http://localhost:8787`. Өөрчлөхгүй бол локал worker ашиглана.

## 3. Backend (Worker) асаах

Терминал 1:

```bash
# Repo root
pnpm dev:worker
```

Worker `http://localhost:8787` дээр ажиллана (GraphQL: `http://localhost:8787/graphql`, REST: `http://localhost:8787/admin/contracts` г.м).

## 4. Frontend (Next.js) асаах

Терминал 2:

```bash
# Repo root
pnpm dev:web
```

Веб `http://localhost:3000` дээр нээгдэнэ. Admin → Vendor contracts руу ороод Employee contract / Vendor contract табууд болон upload, татах зэргийг шалгана.

## Товч

| Алхам                | Команд                                                                   |
| -------------------- | ------------------------------------------------------------------------ |
| Migration (нэг удаа) | `pnpm db:local:employee-contracts`                                       |
| Backend              | `pnpm dev:worker`                                                        |
| Frontend             | `pnpm dev:web`                                                           |
| API URL              | `apps/ebms-web/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:8787` |
