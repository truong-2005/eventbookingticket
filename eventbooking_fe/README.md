# EventBooking Frontend

Giao diện React cho khách hàng, nhân viên và quản trị viên.

## Cần có

- Node.js và npm
- Backend đang chạy tại `http://localhost:8080`

## Cài đặt và chạy

Tại thư mục gốc repository:

```bash
cd eventbooking_fe
npm ci
npm start
```

Mở [http://localhost:3000](http://localhost:3000).

## Nếu backend chạy ở địa chỉ khác

Mở `src/api/axiosClient.js`, sửa `BASE_URL`, rồi khởi động lại frontend. Mặc định địa chỉ là `http://localhost:8080`.

## Một số trang

- `/events`: danh sách sự kiện
- `/events/:id`: chi tiết sự kiện
- `/events/:id/book`: đặt vé
- `/my-tickets`: vé của tôi
- `/login`, `/register`: tài khoản khách hàng

Thanh toán VNPay ở môi trường phát triển là mô phỏng, không chuyển tiền thật.

## Lệnh khác

```bash
npm run build
npm test
```

Xem cách chạy API trong hướng dẫn [Backend](../eventbooking/README.md), hoặc quay lại [README chính](../README.md).
