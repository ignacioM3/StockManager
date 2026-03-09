import { UserRole } from '../types/user-role'
import type { RouterDefinition } from './routes-definition'

const adminLayoutImport = async () => (await import('../layout/AdmiLayout')).AdminLayout

export const warehouseRoutes = {
    warehouseList: {
        route: () => "/admin/warehouse/list",
        page: async () => ((await import('../pages/admin/warehouse/WarehouseList')).WarehouseList),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    warehouseDetails: {
        route: (id?: string) => `/admin/warehouse/details/${id ?? ":id"}`,
        page: async () => ((await import('../pages/admin/warehouse/WarehouseDetails')).WarehouseDetails),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },



} as const satisfies Record<string, RouterDefinition>