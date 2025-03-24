import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    Unique,
  } from "typeorm";
  import { Usuario } from "./Usuario";
  import { Material } from "./Material";
  
  @Entity({ name: "likes" })
  @Unique(["usuario", "material"])
  export class Like {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => Usuario, (usuario) => usuario.likes, { onDelete: "CASCADE" })  
    usuario!: Usuario;
  
    @ManyToOne(() => Material, (material) => material.likes, { onDelete: "CASCADE" })  
    material!: Material;
  
    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;
  }