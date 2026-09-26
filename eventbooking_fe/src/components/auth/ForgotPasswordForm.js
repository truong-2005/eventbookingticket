import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const ForgotPasswordForm = ({ onSubmit, isLoading, error, successMessage }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded text-sm text-center">
          {successMessage}
        </div>
      )}

      <Input 
        id="email" 
        type="email"
        label="Địa chỉ Email đã đăng ký" 
        {...register('email', { 
          required: 'Vui lòng nhập email',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email không hợp lệ'
          }
        })}
        error={errors.email?.message}
      />

      <div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Gửi yêu cầu khôi phục mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
