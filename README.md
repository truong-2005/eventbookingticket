# EventBooking

Ứng dụng đặt vé sự kiện gồm giao diện React và REST API Spring Boot. Repository có cả frontend (FE) và backend (BE).

## Chuẩn bị

- Git
- JDK 21
- Node.js và npm
- MySQL đang chạy

## Chạy ứng dụng

### 1. Tạo cơ sở dữ liệu

Trong MySQL, chạy:

```sql
CREATE DATABASE event_booking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Đặt tài khoản và mật khẩu MySQL của bạn trong `eventbooking/src/main/resources/application-dev.properties`.

### 2. Chạy backend

Mở terminal tại thư mục gốc repository:

```powershell
cd eventbooking
.\mvnw.cmd spring-boot:run
```

Trên macOS/Linux, dùng `./mvnw spring-boot:run`.

Backend chạy tại `http://localhost:8080`.

### 3. Chạy frontend

Mở terminal thứ hai tại thư mục gốc repository:

```bash
cd eventbooking_fe
npm ci
npm start
```

Mở [http://localhost:3000](http://localhost:3000).

## Đường dẫn hữu ích

- API: `http://localhost:8080/api`
- Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- Hướng dẫn [Frontend](eventbooking_fe/README.md) · [Backend](eventbooking/README.md)

Thanh toán VNPay trong cấu hình phát triển là mô phỏng, không chuyển tiền thật. Không đưa mật khẩu hoặc khóa bí mật lên GitHub.
