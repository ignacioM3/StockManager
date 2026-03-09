import { UserRole } from '../types/user-role'
import type { RouterDefinition } from './routes-definition'

const adminLayoutImport = async () => (await import('../layout/AdmiLayout')).AdminLayout

export const notificationsRoutes = {
    notificationsList: {
        route: () => "/admin/notifications/list",
        page: async () => ((await import('../pages/admin/notifications/NotificactionsList')).NotificationList),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    profitHome: {
        route: () => "/admin/profit/home",
        page: async () => ((await import('../pages/admin/profit/Test')).SalesDashboard),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },

} as const satisfies Record<string, RouterDefinition>