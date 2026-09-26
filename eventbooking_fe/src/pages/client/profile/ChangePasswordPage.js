import React, { useState } from 'react';
import ChangePasswordForm from '../../../components/auth/ChangePasswordForm';

const ChangePasswordPage = () => {
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đổi Mật Khẩu</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {success ? (
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Thành công!</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Mật khẩu của bạn đã được cập nhật.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <ChangePasswordForm onSuccess={() => setSuccess(true)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
