import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import useAuth from '../../hooks/useAuth';

const BookingForm = ({ event, onSubmit, loading }) => {
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    quantity: 1,
    customerName: user?.fullName || '',
    customerEmail: user?.email || '',
  });
  const [errors, setErrors] = useState({});

  const totalAmount = event.ticketPrice * form.quantity;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.customerName?.trim()) newErrors.customerName = 'Vui lòng nhập họ tên';
    if (!form.customerEmail?.trim()) newErrors.customerEmail = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail))
      newErrors.customerEmail = 'Email không hợp lệ';
    if (form.quantity < 1 || form.quantity > 10)
      newErrors.quantity = 'Số vé từ 1 đến 10';
    if (form.quantity > event.availableTickets)
      newErrors.quantity = `Chỉ còn ${event.availableTickets} vé`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      eventId: event.id,
      quantity: form.quantity,
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Quantity */}
      <div className="form-group">
        <label className="form-label">Số lượng vé</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            −
          </button>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            max={Math.min(10, event.availableTickets)}
            className="form-input text-center w-20"
          />
          <button
            type="button"
            onClick={() =>
              setForm((p) => ({
                ...p,
                quantity: Math.min(10, event.availableTickets, p.quantity + 1),
              }))
            }
            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            +
          </button>
        </div>
        {errors.quantity && <p className="form-error">{errors.quantity}</p>}
      </div>

      {/* Customer Name */}
      <div className="form-group">
        <label className="form-label">Họ và tên <span className="text-rose-500">*</span></label>
        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          className={errors.customerName ? 'form-input-error' : 'form-input'}
          placeholder="Nguyễn Văn A"
          maxLength={100}
        />
        {errors.customerName && <p className="form-error">{errors.customerName}</p>}
      </div>

      {/* Customer Email */}
      <div className="form-group">
        <label className="form-label">Email <span className="text-rose-500">*</span></label>
        <input
          type="email"
          name="customerEmail"
          value={form.customerEmail}
          onChange={handleChange}
          className={errors.customerEmail ? 'form-input-error' : 'form-input'}
          placeholder="email@example.com"
          maxLength={100}
        />
        {errors.customerEmail && <p className="form-error">{errors.customerEmail}</p>}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Đơn giá</span>
          <span>{formatCurrency(event.ticketPrice)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Số lượng</span>
          <span>× {form.quantity}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
          <span>Tổng cộng</span>
          <span className="text-primary-600">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full btn-lg" disabled={loading}>
        {loading ? 'Đang đặt vé...' : `Đặt ${form.quantity} vé — ${formatCurrency(totalAmount)}`}
      </button>
    </form>
  );
};

export default BookingForm;
