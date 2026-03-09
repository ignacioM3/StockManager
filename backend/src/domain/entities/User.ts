import type { UserRole } from "./User-Role.js";

export interface User {
    id: string;
    password: string;
    email: string;
    name: string;
    confirmed: boolean;
    number?: string;
    blocked?: boolean;
    role: UserRole;
}