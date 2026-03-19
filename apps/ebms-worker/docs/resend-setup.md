# Resend Email Setup

EBMS uses [Resend](https://resend.com) for sending notification emails (warnings, eligibility changes, etc.).

## Setup

### 1. Create Resend account

- Sign up at [resend.com](https://resend.com)
- Create an API key at [resend.com/api-keys](https://resend.com/api-keys)

### 2. Local development

```bash
cd apps/ebms-worker
cp .dev.vars.example .dev.vars
# Edit .dev.vars and add your Resend API key:
# RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

For testing, use `onboarding@resend.dev` as the from address (already set in `wrangler.toml`). Send to `delivered@resend.dev` to simulate delivery.

### 3. Production

1. **Verify your domain** at [resend.com/domains](https://resend.com/domains)
2. **Update `RESEND_FROM_EMAIL`** in `wrangler.toml`:
   ```toml
   RESEND_FROM_EMAIL = "EBMS <noreply@yourdomain.com>"
   ```
3. **Set the API key** as a secret:
   ```bash
   wrangler secret set RESEND_API_KEY
   # Paste your API key when prompted
   ```

4. Deploy:
   ```bash
   wrangler deploy
   ```

## Environment variables

| Variable | Type | Description |
|----------|------|-------------|
| `RESEND_API_KEY` | Secret | Resend API key. Set via `wrangler secret set` or `.dev.vars` (local) |
| `RESEND_FROM_EMAIL` | Var | Sender address. Use `onboarding@resend.dev` for testing; verified domain for production |

## When emails are sent

- **Attendance warning** — 2+ late arrivals in 30 days
- **OKR missing** — OKR not submitted
- **Probation status** — Employee on probation
- **Benefit request approved/rejected**
- **Contract upload required**

If `RESEND_API_KEY` or `RESEND_FROM_EMAIL` is missing, the app logs a warning and skips email (in-app notifications still work).
