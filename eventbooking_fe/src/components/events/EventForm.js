import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '../common/Input';
import Button from '../common/Button';
import uploadApi from '../../api/uploadApi';

const EventForm = ({ initialData, onSubmit, isLoading, categories = [], submitText = 'Lưu', isEdit = false }) => {
  const [imageUploadMode, setImageUploadMode] = React.useState('link'); // 'link' or 'file'
  const [isUploading, setIsUploading] = React.useState(false);

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    values: initialData || {
      totalTickets: 100,
      price: 0
    }
  });

  const watchImageUrl = watch('imageUrl');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const res = await uploadApi.uploadFile(file);
      setValue('imageUrl', res.data.url);
    } catch (err) {
      alert('Lỗi khi tải ảnh lên. ' + (err.response?.data?.message || ''));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input 
        id="title" 
        label="Tên sự kiện" 
        {...register('title', { required: 'Vui lòng nhập tên sự kiện' })} 
        error={errors.title?.message}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sự kiện</label>
        <textarea 
          id="description" 
          rows="4" 
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          {...register('description', { required: 'Vui lòng nhập mô tả' })}
        ></textarea>
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="border border-gray-200 rounded p-4 bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sự kiện</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input type="radio" name="imageMode" checked={imageUploadMode === 'link'} onChange={() => setImageUploadMode('link')} className="mr-2" />
            Nhập Link
          </label>
          <label className="flex items-center">
            <input type="radio" name="imageMode" checked={imageUploadMode === 'file'} onChange={() => setImageUploadMode('file')} className="mr-2" />
            Tải lên từ máy tính
          </label>
        </div>

        {imageUploadMode === 'link' ? (
          <Input
            id="imageUrl"
            label="URL Hình ảnh"
            placeholder="https://example.com/image.jpg"
            {...register('imageUrl')}
          />
        ) : (
          <div className="mt-1">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {isUploading && <p className="text-sm text-blue-600 mt-2">Đang tải ảnh lên...</p>}
            {watchImageUrl && !isUploading && (
              <p className="text-sm text-green-600 mt-2">Ảnh đã được tải lên thành công!</p>
            )}
          </div>
        )}

        {watchImageUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Xem trước:</p>
            <img src={watchImageUrl} alt="Preview" className="h-32 object-contain border rounded bg-white p-1" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            id="categoryId"
            {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-2 text-sm text-red-600">{errors.categoryId.message}</p>}
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="UPCOMING">Sắp diễn ra</option>
              <option value="ONGOING">Đang diễn ra</option>
              <option value="COMPLETED">Đã kết thúc</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        )}
        
        <Input 
          id="location" 
          label="Địa điểm" 
          {...register('location', { required: 'Vui lòng nhập địa điểm' })} 
          error={errors.location?.message}
        />
        
        <Input 
          id="price" 
          type="number" 
          min="0" 
          label="Giá vé (VND)" 
          {...register('price', { required: 'Vui lòng nhập giá vé' })} 
          error={errors.price?.message}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
          <Controller
            control={control}
            name="startTime"
            rules={{ required: 'Vui lòng chọn thời gian bắt đầu' }}
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholderText="Chọn thời gian bắt đầu"
              />
            )}
          />
          {errors.startTime && <p className="mt-2 text-sm text-red-600">{errors.startTime.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholderText="Chọn thời gian kết thúc"
              />
            )}
          />
        </div>
        
        <Input 
          id="totalTickets" 
          type="number" 
          min="1" 
          label="Số lượng vé tổng cộng" 
          {...register('totalTickets', { required: 'Vui lòng nhập số lượng vé' })} 
          error={errors.totalTickets?.message}
        />
      </div>
      
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button type="submit" isLoading={isLoading}>{submitText}</Button>
      </div>
    </form>
  );
};

export default EventForm;
