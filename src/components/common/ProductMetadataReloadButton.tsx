import { Tooltip } from "react-tooltip";
import { useProductMetadata } from "../../app/context/ProductMetadataContext";
import { IoReload } from "react-icons/io5";

export const ProductMetadataReloadButton: React.FC = () => {
  const { refreshMetadata, loading } = useProductMetadata();

  const handleRefresh = async () => {
    try {
      
      // Lặp qua localStorage và xóa bộ nhớ đệm nhưng giữ lại các key cần thiết
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key) {
          const lowerKey = key.toLowerCase();
          
          // Giữ lại jwt, jwt_session_date, theme và các key động bắt đầu bằng birthday-modal-shown
          const isAuthRelated = lowerKey.includes('jwt') || lowerKey.includes('session');
          const isThemeRelated = lowerKey.includes('theme');
          const isBirthdayModal = lowerKey.startsWith('birthday-modal-shown');
          
          if (!isAuthRelated && !isThemeRelated && !isBirthdayModal) {
            localStorage.removeItem(key);
          }
        }
      }

      // Force refresh từ server
      await refreshMetadata(true);
      
      // Tải lại trang để làm mới hoàn toàn các store đang lưu dữ liệu cũ trong RAM
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing metadata:', error);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className={`relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      data-tooltip-id="reload-tooltip"
      data-tooltip-content="Tải lại dữ liệu danh mục"
    >
      <IoReload className={`size-6 ${loading ? 'animate-spin' : ''}`} />
      <Tooltip id="reload-tooltip" className="text-md" />
    </button>
  );
};
