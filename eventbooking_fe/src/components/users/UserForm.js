import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const UserForm = ({ initialData, onSubmit, isLoading, isEdit = false, submitText = 'Lưu' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    values: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isEdit ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập (Không thể sửa)</label>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500">{initialData?.username}</div>
        </div>
      ) : (
        <Input 
          id="username" 
          label="Tên đăng nhập" 
          {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
          error={errors.username?.message}
        />
      )}
      
      {!isEdit && (
        <Input 
          id="password" 
          type="password" 
          label="Mật khẩu" 
          {...register('password', { required: 'Vui lòng nhập mật khẩu', minLength: { value: 6, message: 'Mật khẩu ít nhất 6 ký tự' } })}
          error={errors.password?.message}
        />
      )}

      <Input 
        id="email" 
        type="email" 
        label="Email" 
        {...register('email', { required: 'Vui lòng nhập email', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
        error={errors.email?.message}
      />
      <Input 
        id="fullName" 
        label="Họ và tên" 
        {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
        error={errors.fullName?.message}
      />
      <Input 
        id="phone" 
        label="Số điện thoại" 
        {...register('phone')}
      />
      
      {isEdit && (
        <>
          <hr className="border-gray-200" />
          <h2 className="text-lg font-medium text-gray-900">Đổi mật khẩu (Tùy chọn)</h2>
          <Input 
            id="newPassword" 
            type="password" 
            label="Mật khẩu mới" 
            placeholder="Bỏ trống nếu không muốn đổi"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
        </>
      )}
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>{submitText}</Button>
      </div>
    </form>
  );
};

export default UserForm;
