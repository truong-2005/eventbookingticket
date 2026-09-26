import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Button from '../common/Button';

const CategoryForm = ({ initialData, onSubmit, isLoading, submitText = 'Lưu' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    values: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="name"
        label="Tên danh mục"
        {...register('name', { required: 'Vui lòng nhập tên danh mục' })}
        error={errors.name?.message}
      />
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          id="description"
          rows="4"
          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          {...register('description')}
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="submit" isLoading={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
