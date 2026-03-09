import type { Notification } from "../../../pages/admin/notifications/NotificactionsList";

interface Props {
  notification: Notification;
  onClose: () => void;
}

export function NotificationDrawer({ notification, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">

      <div className="w-full max-w-md bg-white h-full shadow-xl p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Detalle de notificación
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <h3 className="font-bold text-xl mb-2">
          {notification.title}
        </h3>

        <p className="text-gray-600 mb-4">
          {notification.description}
        </p>

        <div className="text-sm text-gray-500">
          Fecha: {notification.createdAt}
        </div>

      </div>
    </div>
  );
}