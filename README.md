# EventBooking

Ứng dụng đặt vé sự kiện gồm giao diện React (FE) và REST API Spring Boot (BE). Cơ sở dữ liệu dùng MySQL.

## Cần cài đặt

- Git
- JDK 21
- Node.js và npm
- Một chương trình chạy MySQL: Laragon, XAMPP hoặc WAMP

## 1. Tải mã nguồn

```bash
git clone https://github.com/truong-2005/eventbookingticket.git
cd eventbookingticket
```

## 2. Khởi chạy MySQL

Chọn một chương trình bạn đã cài:

- **Laragon:** mở Laragon, nhấn **Start All** hoặc khởi chạy MySQL.
- **XAMPP:** mở XAMPP Control Panel, nhấn **Start** ở dòng MySQL.
- **WAMP:** mở WampServer và khởi chạy MySQL từ menu của WAMP.

Ứng dụng không cần Apache để chạy. Apache chỉ cần bật nếu bạn muốn mở phpMyAdmin trên trình duyệt. Bạn cũng có thể tạo cơ sở dữ liệu bằng HeidiSQL hoặc MySQL Workbench.

Tạo cơ sở dữ liệu tên `event_booking_db` bằng phpMyAdmin hoặc chạy câu lệnh:

```sql
CREATE DATABASE event_booking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

## 3. Cấu hình kết nối cơ sở dữ liệu

Mở file `eventbooking/src/main/resources/application-dev.properties` và sửa các dòng kết nối cho khớp với MySQL trên máy bạn:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/event_booking_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=
```

Nếu MySQL dùng cổng hoặc mật khẩu khác, hãy cập nhật tương ứng. Backend tự tạo/cập nhật các bảng khi khởi chạy lần đầu.

## 4. Chạy backend

Mở terminal thứ nhất tại thư mục gốc dự án:

```powershell
cd eventbooking
.\mvnw.cmd spring-boot:run
```

Backend chạy tại `http://localhost:8080`.

Trên macOS/Linux, dùng `./mvnw spring-boot:run`.

## 5. Chạy frontend

Mở terminal thứ hai tại thư mục gốc dự án:

```bash
cd eventbooking_fe
npm ci
npm start
```

Mở trang web tại [http://localhost:3000](http://localhost:3000). Frontend mặc định gọi backend tại `http://localhost:8080`.

## Địa chỉ thường dùng

- Website: [http://localhost:3000](http://localhost:3000)
- Backend API: `http://localhost:8080/api`
- Tài liệu API: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Nếu gặp lỗi

- **Không kết nối được MySQL:** kiểm tra MySQL đã chạy và cổng trong file cấu hình có đúng không.
- **Sai tên đăng nhập hoặc mật khẩu:** sửa `spring.datasource.username` và `spring.datasource.password`.
- **Cổng 8080 đang được dùng:** dừng ứng dụng đang chiếm cổng rồi chạy lại backend.
- **Không tìm thấy Java:** cài JDK 21, kiểm tra `JAVA_HOME`, rồi mở terminal mới.

## Lưu ý

Thanh toán VNPay trong cấu hình phát triển là mô phỏng, không chuyển tiền thật. Không đưa mật khẩu, khóa bí mật hoặc thông tin tài khoản thật lên GitHub.

Xem thêm hướng dẫn tại thư mục [Frontend](eventbooking_fe/) và [Backend](eventbooking/).