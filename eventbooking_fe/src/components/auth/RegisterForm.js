import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = ({ onSubmit, isLoading, error }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  
  const password = watch('password');

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
          {error}
        </div>
      )}

      <Input 
        id="username" 
        label="Tên đăng nhập" 
        {...register('username', { 
          required: 'Vui lòng nhập tên đăng nhập',
          minLength: { value: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
        })}
        error={errors.username?.message}
      />
      
      <Input 
        id="email" 
        type="email"
        label="Email" 
        {...register('email', { 
          required: 'Vui lòng nhập email',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email không hợp lệ'
          }
        })}
        error={errors.email?.message}
      />

      <Input 
        id="fullName" 
        label="Họ và tên" 
        {...register('fullName', { 
          required: 'Vui lòng nhập họ tên'
        })}
        error={errors.fullName?.message}
      />

      <Input 
        id="phone" 
        label="Số điện thoại" 
        {...register('phone', {
          pattern: {
            value: /^0\d{9,10}$/,
            message: 'Số điện thoại không hợp lệ (bắt đầu bằng 0, gồm 10-11 số)'
          }
        })}
        error={errors.phone?.message}
      />

      <Input 
        id="password" 
        type="password"
        label="Mật khẩu" 
        {...register('password', { 
          required: 'Vui lòng nhập mật khẩu',
          minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
        })}
        error={errors.password?.message}
      />
      
      <Input 
        id="confirmPassword" 
        type="password"
        label="Xác nhận mật khẩu" 
        {...register('confirmPassword', { 
          required: 'Vui lòng xác nhận mật khẩu',
          validate: value => value === password || 'Mật khẩu không khớp'
        })}
        error={errors.confirmPassword?.message}
      />

      <div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Đăng ký
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
