import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const ResetPasswordForm = ({ onSubmit, isLoading, error }) => {
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
        id="password" 
        type="password"
        label="Mật khẩu mới" 
        {...register('password', { 
          required: 'Vui lòng nhập mật khẩu',
          minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
        })}
        error={errors.password?.message}
      />
      
      <Input 
        id="confirmPassword" 
        type="password"
        label="Xác nhận mật khẩu mới" 
        {...register('confirmPassword', { 
          required: 'Vui lòng xác nhận mật khẩu',
          validate: value => value === password || 'Mật khẩu không khớp'
        })}
        error={errors.confirmPassword?.message}
      />

      <div>
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Đổi mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
