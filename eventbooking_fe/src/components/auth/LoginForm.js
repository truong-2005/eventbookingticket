import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSubmit, isLoading, error, buttonText = 'Đăng nhập', title = 'Đăng nhập' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input 
          id="login" 
          label="Tên đăng nhập / Email" 
          autoComplete="username"
          {...register('login', { required: 'Vui lòng nhập tên đăng nhập hoặc email' })}
          error={errors.login?.message}
        />

        <Input 
          id="password" 
          type="password"
          label="Mật khẩu" 
          autoComplete="current-password"
          {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
          error={errors.password?.message}
        />

        <div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
