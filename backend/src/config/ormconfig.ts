import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { Material } from "../entity/Material";
import { Comentario } from "../entity/Comentario";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, 
  logging: false,
  entities: [Usuario, Material, Comentario],
  migrations: [],
  subscribers: [],
});