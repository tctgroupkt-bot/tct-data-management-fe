import { useState, useEffect } from 'react';

interface UseDataReadyConfig {
  dependencies: any[];
  loadingStates: boolean[];
  delay?: number;
  enableDebug?: boolean;
}

export const useDataReady = ({ 
  dependencies, 
  loadingStates, 
  delay = 300,
  enableDebug = false 
}: UseDataReadyConfig) => {
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const checkDataReady = () => {
      // Kiểm tra tất cả dependencies đều có data
      const hasAllData = dependencies.every(dep => {
        if (Array.isArray(dep)) {
          return dep.length > 0;
        }
        if (typeof dep === 'object' && dep !== null) {
          return Object.keys(dep).length > 0;
        }
        return Boolean(dep);
      });

      // Kiểm tra không có loading state nào đang true
      const noLoading = loadingStates.every(loading => !loading);

      const allDataReady = hasAllData && noLoading;

      if (enableDebug && import.meta.env.DEV) {
        console.log('useDataReady Check:', {
          hasAllData,
          noLoading,
          allDataReady,
          isDataReady,
          dependencies: dependencies.map(dep => ({
            type: Array.isArray(dep) ? 'array' : typeof dep,
            hasValue: Array.isArray(dep) ? dep.length > 0 : Boolean(dep)
          })),
          loadingStates
        });
      }

      // Thêm delay để đảm bảo sync hoàn tất
      if (allDataReady && !isDataReady) {
        const timer = setTimeout(() => {
          setIsDataReady(true);
          if (enableDebug) {
            console.log('✅ Data ready - user can interact');
          }
        }, delay);

        return () => clearTimeout(timer);
      } else if (!allDataReady && isDataReady) {
        setIsDataReady(false);
        if (enableDebug) {
          console.log('⏳ Data not ready - blocking interaction');
        }
      }
    };

    checkDataReady();
  }, [...dependencies, ...loadingStates, isDataReady]);

  return isDataReady;
};

export default useDataReady;
