# EventBooking Backend

REST API Spring Boot cho ứng dụng đặt vé sự kiện.

## Cần có

- JDK 21
- MySQL đang chạy

## Cài đặt và chạy

Tạo database trong MySQL:

```sql
CREATE DATABASE event_booking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Đặt tên đăng nhập và mật khẩu MySQL trong `src/main/resources/application-dev.properties`. Không đưa mật khẩu hay khóa bí mật thật lên GitHub.

Tại thư mục gốc repository, chạy backend:

```powershell
cd eventbooking
.\mvnw.cmd spring-boot:run
```

Trên macOS/Linux, dùng `./mvnw spring-boot:run`.

Backend chạy tại `http://localhost:8080`.

## Tài liệu API

- Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- API: `http://localhost:8080/api`

## Lưu ý

VNPay trong cấu hình `dev` là mô phỏng. Để thử luồng này, hãy chạy frontend tại cổng `3000`. Không có giao dịch tiền thật.

Xem hướng dẫn [Frontend](../eventbooking_fe/README.md) hoặc [README chính](../README.md).
