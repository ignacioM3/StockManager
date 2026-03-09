export const userRole = {
    ADMIN: 'Admin',
    CLIENT: 'Client'
} as const;


export type UserRole = (typeof userRole)[keyof typeof userRole]