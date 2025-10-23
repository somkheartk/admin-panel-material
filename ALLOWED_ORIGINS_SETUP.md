# การตั้งค่า ALLOWED_ORIGINS สำหรับแก้ปัญหา localhost:3000,3001
# ALLOWED_ORIGINS Setup to Fix localhost:3000,3001 Issue

## ปัญหา / Problem

หลังจากเพิ่ม environment variables แล้ว backend ยังคงอ่านค่า `localhost:3000` สำหรับ CORS origins

After adding environment variables, the backend still reads `localhost:3000` for CORS origins.

## สาเหตุ / Root Cause

ในไฟล์ `backend/src/main.ts`:

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];  // ← fallback เมื่อไม่มี ALLOWED_ORIGINS
```

เมื่อไม่มี environment variable `ALLOWED_ORIGINS` ระบบจะใช้ค่า default เป็น `['http://localhost:3000']`

## การแก้ไข / Solution

### 1. อัพเดทไฟล์ที่แก้ไขแล้ว / Updated Files

- ✅ `.do/env.yaml.example` - เพิ่ม ALLOWED_ORIGINS
- ✅ `.github/workflows/deploy-backend-app-platform.yml` - เพิ่ม ALLOWED_ORIGINS ใน workflow
- ✅ `ENV_SEPARATION_GUIDE.md` - อัพเดท documentation

### 2. ตั้งค่า GitHub Secret

**ขั้นตอน / Steps:**

1. ไปที่ repository ของคุณบน GitHub
   Go to your repository on GitHub

2. คลิก **Settings** → **Secrets and variables** → **Actions**
   Click **Settings** → **Secrets and variables** → **Actions**

3. คลิก **New repository secret**
   Click **New repository secret**

4. เพิ่ม secret ใหม่:
   Add new secret:
   
   - **Name:** `ALLOWED_ORIGINS`
   - **Value:** URL ของ frontend (คั่นด้วยเครื่องหมายจุลภาค)
   - **Value:** Frontend URL(s) (comma-separated)
   
   **ตัวอย่าง / Examples:**
   - Single domain: `https://your-app.ondigitalocean.app`
   - Multiple domains: `https://your-app.com,https://www.your-app.com,https://api.your-app.com`

5. คลิก **Add secret**

### 3. ทดสอบ / Test

หลังจากตั้งค่า secret แล้ว:

After setting up the secret:

1. **Push code** ไปที่ main branch (หรือ merge PR นี้)
   **Push code** to main branch (or merge this PR)

2. **รอ GitHub Actions** deploy อัตโนมัติ (ประมาณ 5-10 นาที)
   **Wait for GitHub Actions** to deploy automatically (about 5-10 minutes)

3. **ตรวจสอบ deployment:**
   **Verify deployment:**
   
   ```bash
   # ดู logs
   doctl apps logs <APP_ID> --type run
   
   # ตรวจสอบว่า CORS ทำงาน
   curl -H "Origin: https://your-app.com" \
        -H "Access-Control-Request-Method: GET" \
        -X OPTIONS \
        https://your-backend.ondigitalocean.app/health
   ```

4. **ทดสอบจาก frontend:**
   **Test from frontend:**
   
   - เปิด browser console
   - เรียก API จาก frontend
   - ไม่ควรเห็น CORS error

## FAQ

### Q: ต้องตั้งค่า ALLOWED_ORIGINS ด้วยเสมอหรือไม่?
**A:** ใช่ ต้องตั้งค่าเสมอสำหรับ production เพื่อความปลอดภัย

### Q: จะใช้หลาย domain ได้ไหม?
**A:** ได้ คั่นด้วยเครื่องหมายจุลภาค เช่น `https://app1.com,https://app2.com`

### Q: ถ้าลืมตั้งค่าจะเกิดอะไรขึ้น?
**A:** Backend จะใช้ค่า default `localhost:3000` ซึ่งจะทำให้ production frontend ไม่สามารถเรียก API ได้

### Q: จะเปลี่ยน ALLOWED_ORIGINS ภายหลังได้ไหม?
**A:** ได้ แค่ไปแก้ไขที่ GitHub Secrets แล้ว redeploy

### Q: การเปลี่ยนแปลงนี้กระทบ development environment ไหม?
**A:** ไม่ เพราะ development ยังใช้ค่า default `localhost:3000` ได้ตามปกติ

## สรุป / Summary

การแก้ไขนี้ทำให้:

This fix ensures:

1. ✅ Backend ใช้ ALLOWED_ORIGINS จาก environment variable แทน localhost
2. ✅ CORS ทำงานถูกต้องใน production
3. ✅ Security ดีขึ้น (ไม่อนุญาต origin ที่ไม่ได้กำหนด)
4. ✅ Development environment ยังใช้งานได้ตามปกติ

1. ✅ Backend uses ALLOWED_ORIGINS from environment variable instead of localhost
2. ✅ CORS works correctly in production
3. ✅ Better security (only allows specified origins)
4. ✅ Development environment still works normally

## ไฟล์ที่เกี่ยวข้อง / Related Files

- `backend/src/main.ts` - โค้ดที่ใช้ ALLOWED_ORIGINS
- `.do/env.yaml.example` - ตัวอย่างการตั้งค่า
- `.github/workflows/deploy-backend-app-platform.yml` - Workflow ที่ใช้ secret
- `ENV_SEPARATION_GUIDE.md` - คู่มือการใช้งาน environment variables

---

**ผู้แก้ไข / Modified by:** GitHub Copilot
**วันที่ / Date:** October 2025
