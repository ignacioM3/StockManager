import z from "zod";
import { UserRole } from "./user-role";

const authSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password_confirmation: z.string(),
    confirmed: z.boolean(),
    role: z.enum([UserRole.ADMIN, UserRole.CLIENT] as const),
    token: z.string(),
})


export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  confirmed: z.boolean(),
  number: z.number().optional().nullable(),
  password: z.string(),
  blocked: z.boolean().optional(),
  role: z.enum([UserRole.ADMIN, UserRole.CLIENT] as const),
});

export type Auth = z.infer<typeof authSchema>;
export type User = z.infer<typeof userSchema>;



export type UserLogged = Pick<User, 'email' | 'name' | 'role' | 'id' | 'number'>;
export type UserLoginForm = Pick<Auth, 'email' | 'password'>;