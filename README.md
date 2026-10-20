# EventBooking

EventBooking là ứng dụng đặt vé sự kiện gồm giao diện React và REST API Spring Boot. Repository này chứa cả frontend và backend.

## Chức năng chính

- Khách hàng xem sự kiện, đặt vé, theo dõi vé đã đặt và mã QR check-in.
- Nhân viên quản lý sự kiện, danh mục, đơn vé và check-in.
- Quản trị viên quản lý người dùng, vai trò, sự kiện, danh mục, đơn vé và thống kê.
- Backend kiểm tra số vé trong transaction và tự cập nhật trạng thái sự kiện theo thời gian.
- VNPay hiện chạy ở chế độ mô phỏng trong cấu hình phát triển.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 19, React Router, TanStack Query, Axios, Tailwind CSS |
| Backend | Java 21, Spring Boot 4, Spring Security, Spring Data JPA |
| Cơ sở dữ liệu | MySQL |
| Tài liệu API | Springdoc OpenAPI / Swagger UI |

## Cấu trúc repository

```text
eventbooking/       # Backend REST API
eventbooking_fe/    # Frontend React
```

Hướng dẫn chi tiết: [Frontend](eventbooking_fe/README.md) · [Backend](eventbooking/README.md).

## Yêu cầu

- JDK 21
- Node.js và npm
- MySQL đang chạy
- Git

## Chạy ứng dụng local

Clone repository:

```bash
git clone https://github.com/truong-2005/eventbookingticket.git
cd eventbookingticket
```

### 1. Cấu hình và chạy backend

Backend mặc định dùng profile `dev`, chạy ở cổng `8080` và kết nối MySQL tại `localhost:3306` với database `event_booking_db`. Mở `eventbooking/src/main/resources/application-dev.properties` để đặt tên đăng nhập và mật khẩu MySQL của máy bạn.

Nếu tài khoản MySQL không có quyền tự tạo database, tạo schema trước:

```sql
CREATE DATABASE event_booking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Trên Windows, chạy trong terminal thứ nhất:

```powershell
cd eventbooking
.\mvnw.cmd spring-boot:run
```

Trên macOS/Linux:

```bash
cd eventbooking
./mvnw spring-boot:run
```

### 2. Cấu hình và chạy frontend

Mở terminal thứ hai tại thư mục gốc repository:

```bash
cd eventbooking_fe
npm ci
npm start
```

Frontend mở tại [http://localhost:3000](http://localhost:3000) và mặc định gọi API tại `http://localhost:8080`. Nếu backend chạy ở địa chỉ khác, cập nhật `BASE_URL` trong `eventbooking_fe/src/api/axiosClient.js`.

## Địa chỉ local

| Dịch vụ | Địa chỉ |
| --- | --- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend API | `http://localhost:8080/api` |
| Swagger UI | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) |
| OpenAPI JSON | [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) |

## Thanh toán mô phỏng

Cấu hình `dev` chuyển giao dịch VNPay tới trang `/mock-vnpay` của frontend. Đây là luồng demo để thử quy trình đặt vé và trạng thái thanh toán; không chuyển tiền thật. Để luồng này hoạt động, hãy chạy frontend tại cổng `3000`.

## Lưu ý cấu hình

- Cấu hình SMTP trong `application-dev.properties` nếu cần dùng chức năng gửi email.
- Các giá trị JWT, SMTP và VNPay trong cấu hình phát triển chỉ phục vụ local. Hãy thay bằng thông tin riêng và không commit mật khẩu, khóa bí mật hoặc thông tin tài khoản thật.
- `application-prod.properties` cần được cấu hình riêng trước khi triển khai production.

## Lệnh thường dùng

```bash
# Frontend
npm start
npm run build
npm test
```

```powershell
# Backend trên Windows
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
.\mvnw.cmd package
```

Trên macOS/Linux, thay `mvnw.cmd` bằng `./mvnw`.
