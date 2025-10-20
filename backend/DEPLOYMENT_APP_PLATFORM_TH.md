# คู่มือการ Deploy Backend ไปยัง DigitalOcean App Platform

## ภาพรวม

DigitalOcean App Platform เป็นบริการ PaaS (Platform as a Service) ที่ช่วยให้คุณ deploy แอปพลิเคชันได้ง่ายขึ้น โดยไม่ต้องจัดการ server หรือ Docker containers เอง

## ขั้นตอนการ Deploy แบบง่าย

### 1. เตรียม GitHub Secrets

เพิ่ม secrets ใน GitHub repository (Settings → Secrets and variables → Actions):

- `DIGITALOCEAN_ACCESS_TOKEN` - Token จาก DigitalOcean API
- `MONGODB_URI` - Connection string ของ MongoDB

### 2. รับ DigitalOcean API Token

1. เข้า [DigitalOcean Dashboard](https://cloud.digitalocean.com)
2. ไปที่ **API** → **Tokens/Keys**
3. คลิก **Generate New Token**
4. ตั้งชื่อ (เช่น "GitHub Actions")
5. เลือก Read และ Write
6. Copy token และเพิ่มใน GitHub Secrets

### 3. ตั้งค่า MongoDB

**ตัวเลือก A: ใช้ DigitalOcean Managed MongoDB**
- ราคาเริ่มต้น $15/เดือน
- ไปที่ Databases → Create Database → เลือก MongoDB
- Copy connection string

**ตัวเลือก B: ใช้ MongoDB Atlas (มี Free Tier)**
- ไปที่ [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- สร้าง free cluster
- Copy connection string

### 4. Deploy

การ deploy จะเกิดขึ้นอัตโนมัติเมื่อ:
- Push โค้ดไปที่ branch `main` (ถ้ามีการเปลี่ยนแปลงใน `backend/`)
- หรือ trigger manually จาก GitHub Actions tab

**การ trigger manually:**
1. ไปที่ GitHub repository
2. คลิก **Actions**
3. เลือก **Deploy Backend to DigitalOcean App Platform**
4. คลิก **Run workflow**

การ deploy ใช้เวลาประมาณ 5-10 นาที

## การตรวจสอบ

### ดู Logs

```bash
# ติดตั้ง doctl
brew install doctl  # macOS
# หรือ wget สำหรับ Linux

# Login
doctl auth init

# ดู logs
doctl apps list
doctl apps logs <APP_ID> --type run
```

### ตรวจสอบ Health

```bash
curl https://your-app-url.ondigitalocean.app/health
```

## ค่าใช้จ่าย

### แบบประหยัด (Development/Testing)
- App Platform Basic XXS: $5/เดือน
- ใช้ MongoDB Atlas Free Tier: $0
- **รวม: $5/เดือน**

### แบบ Production
- App Platform Basic S (2 instances): $48/เดือน
- Managed MongoDB Basic: $15/เดือน
- **รวม: $63/เดือน**

## การแก้ปัญหา

### App ไม่ทำงาน

1. ตรวจสอบ logs:
   ```bash
   doctl apps logs <APP_ID> --type run
   ```

2. ตรวจสอบ environment variables:
   - `PORT` = `3001`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = (connection string ที่ถูกต้อง)

3. ตรวจสอบ MongoDB connection:
   - ใน DigitalOcean Managed Database → Settings → Trusted Sources
   - เพิ่ม "All App Platform apps"

### Build ล้มเหลว

```bash
doctl apps logs <APP_ID> --type build
```

ปัญหาที่พบบ่อย:
- ขาด dependencies ใน package.json
- Build error จาก TypeScript
- Build/run commands ไม่ถูกต้อง

## คำสั่งที่ใช้บ่อย

```bash
# ดูรายการ apps ทั้งหมด
doctl apps list

# ดูรายละเอียด app
doctl apps get <APP_ID>

# ดู logs
doctl apps logs <APP_ID> --type run

# อัพเดท app
doctl apps update <APP_ID> --spec .do/app.yaml

# Rollback
doctl apps list-deployments <APP_ID>
doctl apps create-deployment <APP_ID> --deployment-id <DEPLOYMENT_ID>
```

## เอกสารเพิ่มเติม

- รายละเอียดทั้งหมดใน: `backend/DEPLOYMENT_APP_PLATFORM.md`
- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [doctl Documentation](https://docs.digitalocean.com/reference/doctl/)
