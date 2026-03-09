import { useMemo, useState } from "react";
import { PageContainer } from "../../../component/styles/PageContainer";
import { PageHeader } from "../../../component/styles/PageHeader";
import { PageTitle } from "../../../component/styles/PageTitle";
import { PageContent } from "../../../component/styles/PageContent";
import { NotificationDrawer } from "../../../component/modal/admin/NotificationDrawer";

type Severity = "info" | "warning" | "critical";

export interface Notification {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  read: boolean;
  createdAt: string;
}

export function NotificationList() {
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");
  const [selectedNotification, setSelectedNotification] =
  useState<Notification | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Producto sin stock",
      description: "Café Molido quedó sin stock en todas las sucursales.",
      severity: "critical",
      read: false,
      createdAt: "02 Mar 2026"
    },
    {
      id: "2",
      title: "Nueva venta registrada",
      description: "Se registró una venta por $45.000 en Sucursal Centro.",
      severity: "info",
      read: true,
      createdAt: "02 Mar 2026"
    },
    {
      id: "3",
      title: "Stock bajo",
      description: "Yerba Mate Premium tiene menos de 5 unidades.",
      severity: "warning",
      read: false,
      createdAt: "01 Mar 2026"
    }
  ]);

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter(n => !n.read);
    if (filter === "critical") return notifications.filter(n => n.severity === "critical");
    return notifications;
  }, [filter, notifications]);

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "critical":
        return "border-l-red-500";
      case "warning":
        return "border-l-yellow-500";
      default:
        return "border-l-blue-500";
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex justify-between items-center w-full">
          <PageTitle>Notificaciones</PageTitle>

          <button
            onClick={markAllAsRead}
            className="text-sm text-orange-600 font-semibold hover:underline transition"
          >
            Marcar todas como leídas
          </button>
        </div>
      </PageHeader>

      <PageContent>
        <div className="space-y-6">

          {/* TABS */}
          <div className="flex gap-6 border-b border-[#f3ead0] pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`text-sm font-semibold pb-1 ${
                filter === "all"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Todas
            </button>

            <button
              onClick={() => setFilter("unread")}
              className={`text-sm font-semibold pb-1 ${
                filter === "unread"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              No leídas
            </button>

            <button
              onClick={() => setFilter("critical")}
              className={`text-sm font-semibold pb-1 ${
                filter === "critical"
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Críticas
            </button>
          </div>

          {/* LISTA */}
          <div className="bg-white rounded-2xl shadow border border-[#f3ead0] divide-y divide-[#f3ead0]">

            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay notificaciones.
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => setSelectedNotification(notification)}
                  className={`p-4 border-l-4 ${getSeverityColor(
                    notification.severity
                  )} ${
                    !notification.read ? "bg-orange-50" : "bg-white"
                  } hover:bg-orange-100 transition cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">
                      {notification.title}
                    </h3>

                    <span className="text-xs text-gray-500">
                      {notification.createdAt}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {notification.description}
                  </p>

                  {!notification.read && (
                    <span className="inline-block mt-2 text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full font-medium">
                      Nueva
                    </span>
                  )}
                </div>
              ))
            )}

          </div>

        </div>
        {selectedNotification && (
  <NotificationDrawer
    notification={selectedNotification}
    onClose={() => setSelectedNotification(null)}
  />
)}
      </PageContent>
    </PageContainer>
  );
}