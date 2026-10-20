# EventBooking Frontend

Ứng dụng web đặt vé sự kiện của EventBooking. Frontend cung cấp giao diện cho khách hàng, nhân viên và quản trị viên; dữ liệu được lấy từ REST API của backend.

## Chức năng

- Khách hàng: đăng ký, đăng nhập, xem sự kiện, đặt vé, xem vé đã đặt và quản lý hồ sơ.
- Thanh toán VNPay mô phỏng và hiển thị vé điện tử có mã QR.
- Nhân viên: quản lý sự kiện, danh mục, đơn đặt vé và quét mã vé để check-in.
- Quản trị viên: quản lý sự kiện, danh mục, đơn đặt vé, người dùng, vai trò và xem thống kê.
- Giao diện phân quyền theo tài khoản; các API cần đăng nhập gửi access token tự động.

## Công nghệ

- React 19 và Create React App
- React Router
- TanStack Query và Axios
- Tailwind CSS
- Chart.js, React Hook Form và React Hot Toast

## Yêu cầu

- Node.js và npm
- Backend EventBooking đang chạy tại `http://localhost:8080`
- MySQL được cấu hình và đang chạy cho backend

## Cài đặt và chạy

```bash
# Clone repository frontend từ GitHub rồi chuyển vào thư mục dự án
cd eventbooking_fe

npm ci
npm start
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt. Để frontend gọi backend ở địa chỉ khác, sửa `BASE_URL` trong `src/api/axiosClient.js` rồi khởi động lại frontend.

## Lệnh thường dùng

```bash
npm start       # Chạy môi trường phát triển
npm run build   # Tạo bản build production trong thư mục build/
npm test        # Chạy test của Create React App
```

## Các đường dẫn chính

| Đường dẫn | Mục đích |
| --- | --- |
| `/` | Trang chủ |
| `/events` | Danh sách sự kiện |
| `/events/:id` | Chi tiết sự kiện |
| `/events/:id/book` | Đặt vé (cần đăng nhập) |
| `/my-tickets` | Vé của tôi |
| `/login`, `/register` | Đăng nhập và đăng ký khách hàng |
| `/staff/login` | Đăng nhập nhân viên |
| `/admin/login` | Đăng nhập quản trị viên |

Các trang quản trị và nhân viên yêu cầu tài khoản có đúng vai trò. Xem danh sách route đầy đủ trong `src/constants/routes.js`.

## Cấu hình API

Địa chỉ backend hiện được đặt trực tiếp trong `src/api/axiosClient.js`:

```js
const BASE_URL = 'http://localhost:8080';
```

Axios tự gửi access token và làm mới token khi API trả về lỗi xác thực phù hợp. Nếu đổi cổng hoặc tên miền backend, cập nhật địa chỉ này trước khi chạy frontend.

## Thanh toán mô phỏng

Cấu hình phát triển của backend chuyển đến trang `/mock-vnpay` trên frontend. Đây là luồng demo để thử giao diện và trạng thái đơn; không thực hiện chuyển tiền thật.

## Cấu trúc thư mục

```text
src/
├── api/          # Các hàm gọi REST API
├── components/   # Thành phần giao diện dùng lại
├── context/      # Trạng thái dùng chung, gồm xác thực
├── layouts/      # Bố cục client, staff và admin
├── pages/        # Các trang theo vai trò
├── hooks/        # React hooks dùng lại
└── utils/        # Hàm tiện ích
```

## Làm việc cùng backend

Khởi động backend trước hoặc đồng thời với frontend. Hướng dẫn cài đặt backend nằm trong README của repository backend. Mặc định frontend gọi `http://localhost:8080`.