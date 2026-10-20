# EventBooking Backend

REST API cho hệ thống quản lý sự kiện và đặt vé EventBooking. Backend xử lý xác thực, phân quyền, dữ liệu sự kiện, đơn đặt vé và thanh toán.

## Chức năng

- Đăng ký, đăng nhập, làm mới token và phân quyền theo vai trò khách hàng, nhân viên, quản trị viên.
- Quản lý sự kiện, danh mục, đơn đặt vé, người dùng và thống kê.
- Kiểm tra số vé trong transaction để tránh bán vượt số lượng còn lại.
- Cập nhật trạng thái sự kiện theo ngày giờ bằng scheduler phía backend.
- Tải ảnh lên, gửi email cho quy trình quên hoặc đặt lại mật khẩu.
- VNPay mô phỏng trong cấu hình phát triển.

## Công nghệ

- Java 21
- Spring Boot 4.1.1, Spring MVC, Spring Security và Spring Data JPA
- MySQL
- Maven Wrapper
- Springdoc OpenAPI / Swagger UI

## Yêu cầu

- JDK 21
- MySQL đang chạy và thông tin kết nối có quyền tạo hoặc cập nhật schema
- Git (nếu clone repository)

## Cài đặt và chạy local

Trong terminal, chuyển vào thư mục backend sau khi clone repository:

```powershell
cd eventbooking
.\mvnw.cmd spring-boot:run
```

Trên macOS hoặc Linux:

```bash
cd eventbooking
./mvnw spring-boot:run
```

Ứng dụng mặc định chạy tại `http://localhost:8080` và dùng profile `dev`. Cấu hình phát triển mặc định dùng MySQL tại `localhost:3306` với database `event_booking_db`. Nếu tài khoản MySQL không có quyền tạo database, hãy tạo schema trước:

```sql
CREATE DATABASE event_booking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

## Cấu hình

- `src/main/resources/application.properties`: cổng server, profile mặc định và cấu hình Swagger.
- `src/main/resources/application-dev.properties`: kết nối MySQL, email, JWT và VNPay cho môi trường phát triển.
- `src/main/resources/application-prod.properties`: cấu hình dành cho môi trường production; cần rà soát và thay toàn bộ giá trị mẫu trước khi triển khai.

Cập nhật thông tin MySQL, SMTP, khóa ký JWT và khóa VNPay theo môi trường của bạn. Không đưa mật khẩu, khóa bí mật, token hoặc thông tin tài khoản thật lên GitHub. Profile `dev` đang trỏ VNPay về frontend local (`http://localhost:3000/mock-vnpay`), vì vậy thanh toán mặc định là mô phỏng và không chuyển tiền thật.

## API và tài liệu

- API base URL: `http://localhost:8080/api`
- Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- OpenAPI JSON: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

Một số nhóm endpoint chính:

| Nhóm | Đường dẫn |
| --- | --- |
| Đăng ký, đăng nhập, token | `/api/register`, `/api/login`, `/api/auth/*` |
| Sự kiện | `/api/events` |
| Danh mục | `/api/categories` |
| Đặt vé | `/api/bookings` |
| Người dùng | `/api/users` |
| Thống kê | `/api/dashboard` |
| Upload | `/api/uploads` |
| Callback VNPay | `/api/payments/vnpay-return` |

Swagger UI hiển thị đầy đủ method, quyền truy cập và cấu trúc request/response.

## Lệnh hữu ích

```powershell
.\mvnw.cmd spring-boot:run  # Chạy backend trên Windows
.\mvnw.cmd test             # Chạy test
.\mvnw.cmd package          # Biên dịch và đóng gói ứng dụng
```

macOS/Linux: chạy `./mvnw spring-boot:run`.

## Làm việc cùng frontend

Frontend mặc định gọi backend tại `http://localhost:8080`; chạy frontend ở cổng `3000` để luồng VNPay mô phỏng có thể quay về đúng trang. Hướng dẫn frontend nằm trong README của repository frontend.