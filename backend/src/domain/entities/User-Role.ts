export const UserRole ={
    ADMIN: 'Admin',
    Client: 'Client'
} as const 

export type UserRole = (typeof UserRole)[keyof typeof UserRole] 