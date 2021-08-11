import { useCallback, useState } from 'react';
import { AlertList } from 'react-bs-notifier';

type Props = {
  alertRef: any;
};

export default function Alert({ alertRef }: Props) {
  const [alerts, setAlerts] = useState<any>([]);

  // types - ["info", "success", "warning", "danger"]
  const showAlert = (type: string, message: string) => {
    setAlerts([
      ...alerts,
      {
        id: new Date().getTime(),
        type: type,
        message: message
      }
    ]);
  };

  const onDismissed = useCallback((alert) => {
    setAlerts((alerts: any) => {
      const idx = alerts.indexOf(alert);
      if (idx < 0) return alerts;
      return [...alerts.slice(0, idx), ...alerts.slice(idx + 1)];
    });
  }, []);

  alertRef.current.showAlert = showAlert;

  return (
    <>
      <AlertList
        position="bottom-right"
        alerts={alerts}
        timeout={3000}
        onDismiss={onDismissed}
      />
    </>
  );
}

Alert.defaultProps = {
  alertRef: { current: {} }
};
