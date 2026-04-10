# 🍜 Mini Food Ordering System
> Bài tập Kiến trúc phần mềm — Buổi 5: **Service-Based Architecture**

---

## 📁 Cấu trúc dự án

```
food-ordering-system/
├── user-service/       → Spring Boot :8081  (Quản lý người dùng + JWT)
├── food-service/       → Spring Boot :8082  (Quản lý món ăn)
├── order-service/      → Spring Boot :8083  (Quản lý đơn hàng)
├── payment-service/    → Spring Boot :8084  (Thanh toán)
├── notification-service/ → Spring Boot :8085 (Demo Gửi thông báo)
└── frontend/           → React + Vite + Tailwind + Axios :5173
```

---

## 🚀 Khởi động nhanh (Local)

### 1. Yêu cầu
- Java 17+
- Maven 3.8+
- Node.js 18+
- MongoDB Community Server (local) hoặc MongoDB Atlas

### 2. MongoDB — Chạy local

```bash
# Windows (nếu cài MongoDB Community)
mongod --dbpath C:\data\db

# Hoặc dùng Docker
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 3. Chạy Backend Services

> Mỗi service chạy trong terminal riêng:

```bash
# Terminal 1 — User Service (port 8081)
cd user-service
mvn spring-boot:run

# Terminal 2 — Food Service (port 8082)
cd food-service
mvn spring-boot:run

# Terminal 3 — Order Service (port 8083)
cd order-service
mvn spring-boot:run

# Terminal 4 — Payment Service (port 8084)
cd payment-service
mvn spring-boot:run
```

### 4. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Mở: **http://localhost:5173**

---

## 🔧 Cấu hình MongoDB Atlas (thay thế local)

Trong mỗi service, mở `src/main/resources/application.yml` và thay:

```yaml
spring:
  data:
    mongodb:
      # Comment dòng local:
      # uri: mongodb://localhost:27017/food_ordering_users

      # Uncomment Atlas:
      uri: mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/food_ordering_users
```

---

## 🌐 Cấu hình LAN (nhiều máy)

### Backend — `application.yml` của mỗi service

```yaml
# order-service/application.yml
services:
  user-service:
    url: http://192.168.1.101:8081     # IP máy người 2
  food-service:
    url: http://192.168.1.102:8082     # IP máy người 3

# Thêm IP frontend vào CORS
app:
  cors:
    allowed-origins: http://192.168.1.100:5173
```

### Frontend — `src/config/serviceConfig.js`

```js
const SERVICE_CONFIG = {
  USER_SERVICE:    'http://192.168.1.101:8081',
  FOOD_SERVICE:    'http://192.168.1.102:8082',
  ORDER_SERVICE:   'http://192.168.1.103:8083',
  PAYMENT_SERVICE: 'http://192.168.1.104:8084',
};
```

---

## 🌱 DataInitializer — Bật/tắt seed data

### Bật seed (mặc định):
```yaml
# application.yml
app:
  data:
    init:
      enabled: true
```

### Tắt seed (production):
```yaml
app:
  data:
    init:
      enabled: false
```

### Qua biến môi trường:
```bash
DATA_INIT_ENABLED=false mvn spring-boot:run
```

---

## 📋 API Endpoints

| Service | Method | Path | Mô tả |
|---------|--------|------|-------|
| **User** | POST | `/api/v1/users/register` | Đăng ký |
| **User** | POST | `/api/v1/users/login` | Đăng nhập |
| **User** | GET | `/api/v1/users` | Danh sách users |
| **User** | GET | `/api/v1/users/{id}/validate` | Validate user (internal) |
| **Food** | GET | `/api/v1/foods` | Danh sách món ăn |
| **Food** | POST | `/api/v1/foods` | Thêm món ăn |
| **Food** | PUT | `/api/v1/foods/{id}` | Sửa món ăn |
| **Food** | DELETE | `/api/v1/foods/{id}` | Xóa món ăn |
| **Order** | POST | `/api/v1/orders` | Tạo đơn hàng |
| **Order** | GET | `/api/v1/orders` | Danh sách đơn |
| **Order** | GET | `/api/v1/orders/user/{userId}` | Đơn của user |
| **Order** | PATCH | `/api/v1/orders/{id}/status` | Cập nhật trạng thái |
| **Payment** | POST | `/api/v1/payments` | Thanh toán |
| **Payment** | GET | `/api/v1/payments` | Danh sách payments |

---

## 🎭 Kịch bản Demo

1. Mở http://localhost:5173
2. Đăng nhập: `admin` / `admin123`
3. Xem danh sách món → Thêm vào giỏ hàng
4. Vào giỏ → Đặt hàng
5. Chọn phương thức (COD / Chuyển khoản) → Thanh toán
6. Xem notification log trên console của payment-service
7. Kiểm tra đơn hàng trong tab "Đơn hàng"

---

## 🏆 Tiêu chí chấm điểm

| Tiêu chí | Điểm |
|----------|------|
| Đúng kiến trúc Service-Based | 3 |
| API hoạt động | 2 |
| Giao tiếp giữa services | 2 |
| Frontend chạy mượt | 1.5 |
| Demo hoàn chỉnh | 1 |
| **Tổng** | **9.5** |

---

## 👥 Phân công (Mô hình LAN)

| Người | Phụ trách | Port |
|-------|-----------|------|
| 1 | Frontend (React + Vite + Tailwind) | :5173 |
| 2 | User Service | :8081 |
| 3 | Food Service | :8082 |
| 4 | Order Service | :8083 |
| 5 | Payment Service & Notification Service (2 Microservices) | :8084, :8085 |

---

## 🔐 Tài khoản mặc định (DataInitializer)

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user1 | user123 | USER |
| user2 | user123 | USER |

---

*Kiến trúc phần mềm — Buổi 5: Service-Based Architecture*
