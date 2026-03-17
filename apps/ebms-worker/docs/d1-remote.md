# D1 Remote — хүснэгт үүсгэх, мөр нэмэх

## UI амжилттай гэж гарч байгаа ч Cloudflare D1-д өгөгдөл байхгүй бол

Add-benefit хуудас **аль API руу** request илгээж байгаагаас шалтгаална:

| NEXT_PUBLIC_API_URL (ebms-web)              | Юу болох вэ                                                                                         |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `http://localhost:8787` эсвэл тохируулаагүй | Бүх өгөгдөл **орон нутгийн D1** руу орно (wrangler dev). Cloudflare dashboard-ийн D1-д харагдахгүй. |
| `https://ebms-api.xxx.workers.dev`          | Deploy хийсэн worker руу очино → **remote D1** руу бичигдэнэ. Dashboard дээр харагдана.             |

**Хийх зүйл:**

1. **ebms-web** дээр remote worker ашиглах: `.env` эсвэл `.env.local`-д  
   `NEXT_PUBLIC_API_URL=https://ebms-api.таны-дэлгэц.workers.dev`  
   (эсвэл `/graphql`-тэй байсан ч add-benefit код одоо зөв боловсруулна)
2. Дараа нь **dev server дахин асаана** (эсвэл build дахин): `npm run dev` эсвэл `npm run build`
3. Remote D1 дээр **migration** ажилласан эсэхийг шалгана (доорх 2-р бүлэг).

---

Remote D1 дээр мөр (row) үүсгэж чадахгүй бол ихэвчлэн **хүснэгтүүд үүсээгүй** байна. Дараах алхмуудыг дагана.

## 1. Cloudflare API Token (remote migration-д заавал)

Remote D1 дээр migration ажиллуулахын тулд **CLOUDFLARE_API_TOKEN** хэрэгтэй.

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens → Create Token.
2. Template: **Edit Cloudflare Workers** эсвэл Custom token-д **Account** → **Cloudflare Workers Scripts: Edit**, **D1: Edit** зэрэг эрх өгнө.
3. Token-оо хуулж, терминалд (нэг удаа):

```bash
export CLOUDFLARE_API_TOKEN="таны_token_энд"
cd apps/ebms-worker
npm run db:migrate:remote
```

Эсвэл `.dev.vars` (git-д оруулахгүй) эсвэл орчны хувьсагчаар тохируулна.

**Анхаар:** `npm run login` нь браузерт зориулсан; CI эсвэл терминал дээр remote command ажиллуулахдаа token заавал тохируулна.

## 2. Remote D1 дээр migration ажиллуулах

Нэг дор хоёр migration (init + eligibility_config):

```bash
npm run db:migrate:remote
```

Эсвэл тусад нь:

```bash
# Хүснэгтүүд: employees, benefits, eligibility_rules, benefit_eligibility, benefit_requests, contracts, eligibility_audit
npm run db:migrate

# eligibility_config хүснэгт (rules config)
npm run db:migrate:config
```

Амжилттай бол `Commands executed successfully` гэж гарна.

## 3. Шалгах

- Cloudflare Dashboard → Workers & Pages → D1 → **ebms-db** → Data: хүснэгтүүд харагдана.
- Дараа нь deploy хийсэн worker (createBenefit, getEligibilityRuleConfig г.м) remote D1-д мөр нэмж чадна.

## Алдаа гарвал

| Алдаа                                           | Шалтгаан                                               | Зүйл хийх                                                                    |
| ----------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `Unknown database` / `database_id`              | wrangler.toml дахь `database_id` энэ account-д байхгүй | Dashboard → D1 → Create database, дахиад wrangler.toml-д `database_id` засах |
| `Authentication error`                          | Нэвтрээгүй эсвэл token дуусаагүй                       | `npm run login` дахин ажиллуулах                                             |
| `Failed query` / `no such table` (deploy дараа) | Remote дээр migration ажиллаагүй                       | `npm run db:migrate:remote` ажиллуулах                                       |

## Script-ууд (package.json)

| Script              | Юу хийх вэ                                 |
| ------------------- | ------------------------------------------ |
| `db:migrate`        | Remote: 0000_init.sql (бүх үндсэн хүснэгт) |
| `db:migrate:config` | Remote: 0001_eligibility_config.sql        |
| `db:migrate:remote` | Дээр хоёрыг дараалан ажиллуулна            |
| `db:local`          | Локал D1: init                             |
| `db:local:config`   | Локал D1: eligibility_config               |
