import { useStore } from "../stores/store.ts";
import { useEffect } from "react";
import RoleBasedLayout from "./RoleBasedLayout.tsx";
import { ProductMetadataProvider } from "../context/ProductMetadataContext";
import { observer } from "mobx-react-lite";
import { SyncService } from "../services/syncService";
import { NetworkStatus } from "../components/common/NetworkStatus";
import { Navigate } from "react-router-dom";
import "../common/common.ts";

const App = observer(() => {
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.shouldForceLogout()) {
      userStore.logout();
      commonStore.setAppLoaded();
      return;
    }

    if (commonStore.token && !userStore.user) {
      userStore.getUser().finally(() => {
        commonStore.setAppLoaded();
      });
    } else if (!commonStore.token) {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  useEffect(() => {
    const validateSession = () => {
      if (commonStore.shouldForceLogout()) {
        userStore.logout();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        validateSession();
      }
    };

    window.addEventListener("focus", validateSession);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const intervalId = window.setInterval(validateSession, 60 * 1000);

    return () => {
      window.removeEventListener("focus", validateSession);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [commonStore, userStore]);

  // Initialize sync service
  useEffect(() => {
    SyncService.init();
  }, []);

  if (!commonStore.appLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (!userStore.user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <NetworkStatus>
      <div className="app">
        <ProductMetadataProvider>
          <RoleBasedLayout />
        </ProductMetadataProvider>
      </div>
    </NetworkStatus>
  );
});

export default App;
