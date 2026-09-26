const fs = require('fs');
const path = require('path');

const basePath = 'c:\\eventbooking_fe\\src\\pages';

function generatePlaceholder(filePath, componentName, title) {
  const content = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/common/Button';

const ${componentName} = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto text-center mt-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">${title}</h1>
      <p className="text-gray-600 mb-6">Tính năng này đang được phát triển hoặc hiển thị chi tiết (Coming soon).</p>
      <Button onClick={() => navigate(-1)}>Quay lại</Button>
    </div>
  );
};

export default ${componentName};
`;
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
}

// Admin
generatePlaceholder(path.join(basePath, 'admin', 'roles', 'RoleCreatePage.js'), 'RoleCreatePage', 'Thêm Role Mới');
generatePlaceholder(path.join(basePath, 'admin', 'roles', 'RoleEditPage.js'), 'RoleEditPage', 'Sửa Role');
generatePlaceholder(path.join(basePath, 'admin', 'events', 'EventDetailPage.js'), 'EventDetailPage', 'Chi tiết sự kiện');
generatePlaceholder(path.join(basePath, 'admin', 'bookings', 'BookingDetailPage.js'), 'BookingDetailPage', 'Chi tiết đặt vé');
generatePlaceholder(path.join(basePath, 'admin', 'users', 'UserDetailPage.js'), 'UserDetailPage', 'Chi tiết người dùng');

// Staff
generatePlaceholder(path.join(basePath, 'staff', 'bookings', 'BookingDetailPage.js'), 'BookingDetailPage', 'Chi tiết đặt vé');
generatePlaceholder(path.join(basePath, 'staff', 'bookings', 'CheckBookingPage.js'), 'CheckBookingPage', 'Kiểm tra vé (Check-in)');
