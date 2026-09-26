import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import eventApi from '../../../api/eventApi';
import bookingApi from '../../../api/bookingApi';
import { formatCurrency } from '../../../utils/formatCurrency';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';

const CreateBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      quantity: 1,
      paymentMethod: 'VNPAY'
    }
  });

  const quantity = watch('quantity');

  const { data: event, isLoading, error: queryError } = useQuery({
    queryKey: ['eventBooking', id],
    queryFn: async () => {
      const response = await eventApi.getEventById(id);
      return response.data;
    }
  });

  const bookingMutation = useMutation({
    mutationFn: (payload) => bookingApi.createBooking(payload),
    onSuccess: (res) => {
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        navigate(ROUTES.MY_TICKETS, { state: { newBooking: res.data } });
      }
    }
  });

  const onSubmit = (formData) => {
    bookingMutation.mutate({
      eventId: parseInt(id, 10),
      quantity: parseInt(formData.quantity, 10),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      paymentMethod: formData.paymentMethod
    });
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    setValue('quantity', parseInt(quantity, 10) + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    setValue('quantity', Math.max(1, parseInt(quantity, 10) - 1));
  };

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (queryError || !event) {
    return <div className="min-h-screen flex justify-center items-center text-red-500 font-semibold">Không thể tải thông tin sự kiện.</div>;
  }

  const totalPrice = event.ticketPrice * parseInt(quantity, 10);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Xác nhận đặt vé</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg leading-6 font-medium text-blue-900">Thông tin sự kiện</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tên sự kiện</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">{event.title}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Địa điểm</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.location}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Đơn giá vé</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-bold">{formatCurrency(event.ticketPrice)}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Chi tiết đơn hàng</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {bookingMutation.isError && <div className="bg-red-50 text-red-500 p-4 rounded-md">{bookingMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.'}</div>}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="customerName"
                    {...register('customerName', { required: 'Vui lòng nhập họ tên' })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    placeholder="Nhập họ và tên người đi"
                  />
                  {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Email nhận vé</label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="customerEmail"
                    {...register('customerEmail', { required: 'Vui lòng nhập email', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    placeholder="Nhập địa chỉ email"
                  />
                  {errors.customerEmail && <p className="mt-1 text-sm text-red-600">{errors.customerEmail.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Số lượng vé muốn mua</label>
                <div className="mt-1 flex rounded-md shadow-sm w-32">
                  <button 
                    onClick={handleDecrement}
                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 text-center sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                    {...register('quantity')}
                    readOnly
                  />
                  <button 
                    onClick={handleIncrement}
                    className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="VNPAY"
                      {...register('paymentMethod')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Thanh toán VNPay</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="CASH"
                      {...register('paymentMethod')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Thanh toán tại quầy</span>
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Tổng thanh toán:</span>
                <span className="text-2xl font-extrabold text-blue-600">{formatCurrency(totalPrice)}</span>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Quay lại</Button>
                <Button type="submit" variant="primary" isLoading={bookingMutation.isPending}>
                  Tiến hành Đặt Vé
                </Button>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CreateBookingPage;
