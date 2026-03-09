export const UserRole ={
    ADMIN: 'Admin',
    CLIENT: 'Client'
} as const 

export type UserRole = (typeof UserRole)[keyof typeof UserRole] 