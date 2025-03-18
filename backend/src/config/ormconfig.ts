import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../entity/Usuario";
import { Material } from "../entity/Material";
import { Comentario } from "../entity/Comentario";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "teste",
  password: process.env.DB_PASSWORD || "teste",
  database: process.env.DB_NAME || "teste",
  synchronize: false, 
  logging: false,
  entities: [Usuario, Material, Comentario],
  migrations: [],
  subscribers: [],
});