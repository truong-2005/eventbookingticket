import React, { useState, useContext } from 'react';
import { StaffToastContext } from '../../../layouts/StaffLayout';
import userApi from '../../../api/userApi';
import useAuth from '../../../hooks/useAuth';

import { getRoleLabel, getRoleBadgeClass } from '../../../utils/roleHelpers';
import { formatDateTime } from '../../../utils/formatDate';

const StaffProfilePage = () => {
  const { user, updateUser } = useAuth();
  const toast = useContext(StaffToastContext);

  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) { toast?.error('Họ tên không được trống'); return; }
    setLoading(true);
    try {
      const res = await userApi.updateMyInfo({ fullName: profileForm.fullName.trim(), phone: profileForm.phone?.trim() || undefined });
      updateUser(res.data);
      toast?.success('Cập nhật thành công!');
    } catch { toast?.error('Cập nhật thất bại'); } finally { setLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) { toast?.error('Mật khẩu ít nhất 6 ký tự'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast?.error('Mật khẩu không khớp'); return; }
    setLoading(true);
    try {
      await userApi.changePassword(passwordForm);
      toast?.success('Đổi mật khẩu thành công!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast?.error(err.response?.data?.message || 'Đổi mật khẩu thất bại'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fade-in">
      <h1 className="section-title">Hồ sơ của tôi</h1>

      {/* Avatar Card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
          {user?.fullName?.[0] || user?.username?.[0] || 'S'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
          <p className="text-gray-500 text-sm">@{user?.username}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {user?.roles?.map((r) => <span key={r} className={`${getRoleBadgeClass(r)} text-xs`}>{getRoleLabel(r)}</span>)}
          </div>
        </div>
        <p className="ml-auto text-xs text-gray-400">Ngày tham gia:<br />{formatDateTime(user?.createdAt)}</p>
      </div>

      <div className="flex bg-white rounded-xl border border-gray-200 p-1 gap-1">
        {[{ key: 'profile', label: 'Thông tin' }, { key: 'password', label: 'Đổi mật khẩu' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {tab === 'profile' ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input value={profileForm.fullName} onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} className="form-input" placeholder="0912345678" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input value={user?.email} className="form-input bg-gray-50" readOnly />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thông tin'}</button>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {[['currentPassword', 'Mật khẩu hiện tại'], ['newPassword', 'Mật khẩu mới'], ['confirmPassword', 'Xác nhận mật khẩu']].map(([field, label]) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}</label>
                <input type="password" value={passwordForm[field]} onChange={(e) => setPasswordForm((p) => ({ ...p, [field]: e.target.value }))} className="form-input" placeholder="••••••••" />
              </div>
            ))}
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffProfilePage;
