import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const RoleForm = ({ initialData, onSubmit, isLoading, submitText = 'Lưu' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    values: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input 
        id="name" 
        label="Tên vai trò (VD: CUSTOMER, STAFF)" 
        placeholder="Nhập bằng chữ IN HOA"
        {...register('name', { required: 'Vui lòng nhập tên vai trò' })}
        error={errors.name?.message}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả quyền hạn</label>
        <textarea 
          id="description" 
          rows="4" 
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          {...register('description', { required: 'Vui lòng nhập mô tả quyền hạn' })}
        ></textarea>
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>{submitText}</Button>
      </div>
    </form>
  );
};

export default RoleForm;
