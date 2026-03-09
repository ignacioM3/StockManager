import type { DatabaseService } from "../services/DatabaseService.js";
import type { Request, Response } from "express";
import { generateJWT } from "../utils/jwt.js";


export class AuthControllers {
    constructor(private db: DatabaseService) { }
    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const user = await this.db.getUserByEmail(email);
            if (!user) {
                const error = new Error("Credenciales Invalidas");
                return res.status(404).json({ error: error.message });
            }console.log(password);
            console.log(user);
            
            
            if (user?.password !== password) {
                const error = new Error("Password Incorrecto");
                return res.status(401).json({ error: error.message });
            }
            if (user?.blocked) {
                const error = new Error("Usuario Bloqueado comunicarse con el administrador");
                return res.status(403).json({ error: error.message })
            }
            const token = generateJWT({ id: user.id });
            res.send(token);

        } catch (error) {
            res.status(500).json({ error: "Hubo un error en el servidor" });
        }

    }

    perfil = async (req: Request, res: Response) => {
        return res.json(req.user)
    }
}