import { UserRole } from '../types/user-role'
import type { RouterDefinition } from './routes-definition'

const adminLayoutImport = async () => (await import('../layout/AdmiLayout')).AdminLayout

export const inventoryRoutes = {
    inventoryList: {
        route: () => "/admin/inventory/list",
        page: async () => ((await import('../pages/admin/inventory/InventoryList')).InventoryList),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    inventoryListOption: {
         route: () => "/admin/inventory/options",
        page: async () => ((await import('../pages/admin/inventory/InventoryListOption')).InventoryListOption),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    inventoryByWarehouse: {
        route: () => "/admin/inventory/warehouse",
        page: async () => ((await import('../pages/admin/inventory/InventoryByWarehouse')).InventoryByWarehouse),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    inventoryMovements:{
          route: () => "/admin/inventory/movements",
        page: async () => ((await import('../pages/admin/inventory/InventoryMovements')).InventoryMovements),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    lowStockInventory: {
            route: () => "/admin/inventory/low-stock",
            page: async () => ((await import('../pages/admin/inventory/LowStockInventory')).LowStockInventory),
            layout: adminLayoutImport,
            requiresAuth: true,
            allowedRoles: [UserRole.ADMIN],
    }

} as const satisfies Record<string, RouterDefinition>