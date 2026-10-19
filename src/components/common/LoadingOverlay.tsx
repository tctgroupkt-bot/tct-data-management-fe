import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = "Đang tải dữ liệu...",
  className = ""
}) => {
  if (!isLoading) return null;

  return (
    <div className={`absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center ${className}`}>
      <div className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
