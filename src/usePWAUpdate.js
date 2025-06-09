import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function usePWAUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
      setUpdateAvailable(true);
    },
  });

  return { updateAvailable, updateServiceWorker };
}
