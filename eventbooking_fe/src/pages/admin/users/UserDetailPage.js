import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import userApi from '../../../api/userApi';
import Button from '../../../components/common/Button';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await userApi.getUserById(id);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center p-10">Đang tải chi tiết người dùng...</div>;
  if (error || !user) return <div className="text-center p-10 text-red-500">Người dùng không tồn tại hoặc có lỗi xảy ra!</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết Người Dùng</h1>
        <Button onClick={() => navigate(-1)} variant="secondary">Quay lại</Button>
      </div>

      <div className="flex items-center space-x-6 mb-8">
        <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-md">
          {user.fullName?.charAt(0) || user.username?.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
          <p className="text-gray-500">@{user.username}</p>
          <div className="mt-2">
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {user.status === 'ACTIVE' ? 'Đang hoạt động' : 'Bị khóa'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin liên hệ</h3>
        <ul className="space-y-4">
          <li className="flex items-center">
            <span className="w-32 font-medium text-gray-600">Email:</span> 
            <span className="text-gray-900">{user.email || 'Chưa cập nhật'}</span>
          </li>
          <li className="flex items-center">
            <span className="w-32 font-medium text-gray-600">Số điện thoại:</span> 
            <span className="text-gray-900">{user.phone || 'Chưa cập nhật'}</span>
          </li>
          <li className="flex items-center">
            <span className="w-32 font-medium text-gray-600">Roles:</span> 
            <div className="flex space-x-2">
              {user.roles?.map(role => (
                <span key={role.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">{role.name}</span>
              ))}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserDetailPage;
