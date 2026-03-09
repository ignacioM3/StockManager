import { UserRole } from '../types/user-role'

const adminLayoutImport = async () => (await import('../layout/AdmiLayout')).AdminLayout

export const customerRoutes = {
    home: {
        route: () => "/admin/home",
        page: async () => ((await import('../pages/admin/Home')).Home),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    listCustomers:{
        route: () => "/admin/customers",
        page: async () => ((await import('../pages/admin/customer/ListCustomers')).ListCustomers),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    addCustomer: {
        route: () => "/admin/customers/add",
        page: async () => ((await import('../pages/admin/customer/AddCustomer')).AddCustomer),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    updateCustomer: {
        route: (id?: string) => `/admin/customers/update/${id?? ":id"}`,
        page: async () => ((await import('../pages/admin/customer/UpdateCustomer')).UpdateCustomer),
        layout: adminLayoutImport,
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    }
}