import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { Material } from "../entity/Material";
import { Comentario } from "../entity/Comentario";
import { AnexoMaterial } from "../entity/AnexoMaterial";
import { Like } from "../entity/Like"; 
import "dotenv/config";
import { Categoria } from "../entity/Categoria";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, 
  logging: false,
  entities: [Usuario, Material, Comentario, Like, AnexoMaterial, Categoria],
  migrations: [],
  subscribers: [],
});