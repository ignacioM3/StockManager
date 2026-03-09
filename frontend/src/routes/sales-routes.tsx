import { UserRole } from '../types/user-role'
import type { RouterDefinition } from './routes-definition'

const adminLayoutImport = async () => (await import('../layout/AdmiLayout')).AdminLayout

export const salesRoutes = {
    salesListOption: {
        route: () => "/admin/sales/list-option",
        page: async () => ((await import('../pages/admin/sales/ListSalesOption')).ListSalesOption),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    todaySales: {
        route: () => '/admin/sales/today',
        page: async () => ((await import('../pages/admin/sales/TodaySales')).TodaySales),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    weekendSales: {
        route: () => "/admin/sales/weekend",
        page: async () => ((await import('../pages/admin/sales/WeekendSales')).WeekendSales),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    monthlySales: {
          route: () => "/admin/sales/monthly",
        page: async () => ((await import('../pages/admin/sales/MonthlySales')).MonthlySales),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    }
} as const satisfies Record<string, RouterDefinition>