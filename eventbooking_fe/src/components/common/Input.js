import React from 'react';

const Input = React.forwardRef(({ label, id, type = 'text', error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        id={id}
        type={type}
        className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
