import React from 'react';

const Table = ({ columns, data, keyField = 'id', isLoading, emptyMessage = 'Không có dữ liệu' }) => {
  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="py-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((col, index) => (
                <td
                  key={index}
                  className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm ${col.cellClassName || 'text-gray-500'}`}
                >
                  {col.render ? col.render(row) : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
