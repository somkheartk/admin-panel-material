# Docker Deployment Guide / คู่มือการใช้ Docker

This guide explains how to use the Docker images built by the CI/CD pipeline.

คู่มือนี้อธิบายวิธีการใช้งาน Docker images ที่สร้างโดย CI/CD pipeline

## Overview / ภาพรวม

The project includes Docker images for both frontend and backend components:
- **Frontend**: Next.js application
- **Backend**: NestJS API server

โปรเจกต์นี้มี Docker images สำหรับทั้ง frontend และ backend:
- **Frontend**: แอปพลิเคชัน Next.js
- **Backend**: เซิร์ฟเวอร์ API NestJS

## Available Images / Images ที่มีให้ใช้

Images are automatically built and pushed to GitHub Container Registry (GHCR) when changes are pushed to `main` or `develop` branches.

Images จะถูกสร้างและ push ไปยัง GitHub Container Registry (GHCR) อัตโนมัติเมื่อมีการ push ไปยัง branch `main` หรือ `develop`

### Frontend Image
```
ghcr.io/somkheartk/admin-panel-material/frontend:latest
ghcr.io/somkheartk/admin-panel-material/frontend:main
ghcr.io/somkheartk/admin-panel-material/frontend:main-<sha>
```

### Backend Image
```
ghcr.io/somkheartk/admin-panel-material/backend:latest
ghcr.io/somkheartk/admin-panel-material/backend:main
ghcr.io/somkheartk/admin-panel-material/backend:main-<sha>
```

## Running with Docker / การรันด้วย Docker

### Prerequisites / ข้อกำหนดเบื้องต้น

1. Install Docker: https://docs.docker.com/get-docker/
2. Authenticate with GHCR (for private repositories):
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   ```

### Pull Images / ดึง Images

```bash
# Pull frontend image
docker pull ghcr.io/somkheartk/admin-panel-material/frontend:latest

# Pull backend image
docker pull ghcr.io/somkheartk/admin-panel-material/backend:latest
```

### Run Backend / รัน Backend

```bash
docker run -d \
  --name admin-panel-backend \
  -p 3001:3001 \
  -e MONGODB_URI="mongodb://your-mongodb-uri:27017/admin-panel" \
  -e PORT=3001 \
  -e NODE_ENV=production \
  ghcr.io/somkheartk/admin-panel-material/backend:latest
```

**Environment Variables:**
- `MONGODB_URI`: MongoDB connection string (required)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (production, development)

### Run Frontend / รัน Frontend

```bash
docker run -d \
  --name admin-panel-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  ghcr.io/somkheartk/admin-panel-material/frontend:latest
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Backend API URL (required)

### Run Both Services / รันทั้งสองบริการ

Use Docker network to connect frontend and backend:

```bash
# Create a network
docker network create admin-panel-network

# Run MongoDB
docker run -d \
  --name mongodb \
  --network admin-panel-network \
  -p 27017:27017 \
  mongo:latest

# Run Backend
docker run -d \
  --name admin-panel-backend \
  --network admin-panel-network \
  -p 3001:3001 \
  -e MONGODB_URI="mongodb://mongodb:27017/admin-panel" \
  -e PORT=3001 \
  -e NODE_ENV=production \
  ghcr.io/somkheartk/admin-panel-material/backend:latest

# Run Frontend
docker run -d \
  --name admin-panel-frontend \
  --network admin-panel-network \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  ghcr.io/somkheartk/admin-panel-material/frontend:latest
```

### Access the Application / เข้าใช้งานแอปพลิเคชัน

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Building Images Locally / สร้าง Images บนเครื่องของคุณ

### Build Frontend / สร้าง Frontend

```bash
docker build -t admin-panel-frontend:local -f Dockerfile .
```

### Build Backend / สร้าง Backend

```bash
docker build -t admin-panel-backend:local -f backend/Dockerfile ./backend
```

## CI/CD Pipeline / ระบบ CI/CD

The pipeline automatically builds and pushes Docker images when:
- Changes are pushed to `main` or `develop` branches
- Changes are made to relevant paths (app/**, backend/**, etc.)
- Manually triggered via `workflow_dispatch`

Pipeline จะสร้างและ push Docker images อัตโนมัติเมื่อ:
- มีการ push ไปยัง branch `main` หรือ `develop`
- มีการเปลี่ยนแปลงไฟล์ที่เกี่ยวข้อง (app/**, backend/**, ฯลฯ)
- เรียกใช้ด้วยตนเองผ่าน `workflow_dispatch`

### Image Tags / แท็กของ Image

The pipeline creates multiple tags for each build:
- `latest`: Always points to the latest build from the default branch
- `<branch>`: Points to the latest build from a specific branch (e.g., `main`, `develop`)
- `<branch>-<sha>`: Specific commit SHA for reproducible builds
- `pr-<number>`: Pull request builds

## Stopping Containers / หยุดการทำงานของ Container

```bash
# Stop containers
docker stop admin-panel-frontend admin-panel-backend mongodb

# Remove containers
docker rm admin-panel-frontend admin-panel-backend mongodb

# Remove network
docker network rm admin-panel-network
```

## Troubleshooting / การแก้ไขปัญหา

### View Logs / ดูล็อก

```bash
# Frontend logs
docker logs admin-panel-frontend

# Backend logs
docker logs admin-panel-backend

# Follow logs (real-time)
docker logs -f admin-panel-backend
```

### Check Container Status / ตรวจสอบสถานะ Container

```bash
docker ps
```

### Inspect Container / ตรวจสอบรายละเอียด Container

```bash
docker inspect admin-panel-frontend
docker inspect admin-panel-backend
```

### Connect to Container Shell / เชื่อมต่อกับ Shell ของ Container

```bash
# Frontend
docker exec -it admin-panel-frontend sh

# Backend
docker exec -it admin-panel-backend sh
```

## Production Deployment / การ Deploy จริง

For production deployment, consider:
1. Use a container orchestration platform (Kubernetes, Docker Swarm, etc.)
2. Use proper secrets management (not environment variables)
3. Set up health checks and monitoring
4. Configure proper resource limits
5. Use a reverse proxy (Nginx, Traefik) for HTTPS/SSL

สำหรับการ deploy จริง ควรพิจารณา:
1. ใช้ระบบจัดการ container (Kubernetes, Docker Swarm, ฯลฯ)
2. ใช้ระบบจัดการ secrets ที่เหมาะสม (ไม่ใช่ environment variables)
3. ตั้งค่า health checks และระบบ monitoring
4. กำหนด resource limits ที่เหมาะสม
5. ใช้ reverse proxy (Nginx, Traefik) สำหรับ HTTPS/SSL

## Additional Resources / แหล่งข้อมูลเพิ่มเติม

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [NestJS Docker Documentation](https://docs.nestjs.com/)
