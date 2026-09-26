import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';
import authApi from '../../api/authApi';

const ChangePasswordForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      // Assuming an API endpoint exists for change-password. In authApi, wait, it's in userApi!
      // I will put it in userApi later, but for now we'll just mock the axios call or use userApi directly
      // Wait, let's use the standard fetch or axios client since we don't have userApi yet.
      const axiosClient = require('../../api/axiosClient').default;
      await axiosClient.put('/api/users/me/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
        passwordMatching: true
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm">{error}</div>}
      <Input id="currentPassword" type="password" label="Mật khẩu hiện tại" value={formData.currentPassword} onChange={handleChange} required />
      <Input id="newPassword" type="password" label="Mật khẩu mới" value={formData.newPassword} onChange={handleChange} required minLength={6} />
      <Input id="confirmPassword" type="password" label="Xác nhận mật khẩu mới" value={formData.confirmPassword} onChange={handleChange} required />
      
      <Button type="submit" isLoading={isLoading} className="w-full mt-4">
        Đổi mật khẩu
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
