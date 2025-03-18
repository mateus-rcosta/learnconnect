import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";

export class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, senha } = req.body;
      const userRepository = AppDataSource.getRepository(Usuario);
      const user = await userRepository.findOneBy({ email });
      
      if (!user || !bcrypt.compareSync(senha, user.senha)) {
        res.status(401).json({ message: "Credenciais inválidas." });
        return;
      }
      
      // Gera o token com o id e role
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: "8h",
      });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Erro no login.", error });
    }
  };
}