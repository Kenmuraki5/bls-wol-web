import React from 'react';

const Snackbar: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="alert alert-info bg-blue-500 text-white p-4 rounded-lg mb-6">
      <div className="flex items-center">
        <i className="bi bi-info-circle text-xl mr-2"></i>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Snackbar;
