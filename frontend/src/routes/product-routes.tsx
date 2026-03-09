import { UserRole } from '../types/user-role'
import type { RouterDefinition } from './routes-definition'

const adminLayoutImport = async () => (await import('../layout/AdmiLayout')).AdminLayout

export const productRoutes = {
    productList: {
        route: () => "/admin/product/list",
        page: async () => ((await import('../pages/admin/product/ProductList')).ProductList),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },

} as const satisfies Record<string, RouterDefinition>