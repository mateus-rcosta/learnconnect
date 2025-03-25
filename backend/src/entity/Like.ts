import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    Unique,
    JoinColumn,
  } from "typeorm";
  import { Usuario } from "./Usuario";
  import { Material } from "./Material";
  
  @Entity({ name: "likes" })
  @Unique(["usuario", "material"])
  export class Like {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => Usuario, (usuario) => usuario.likes, { onDelete: "CASCADE" }) 
    @JoinColumn({ name: "usuario_id" })   
    usuario!: Usuario;
  
    @ManyToOne(() => Material, (material) => material.likes, { onDelete: "CASCADE" }) 
    @JoinColumn({ name: "material_id" })   
    material!: Material;
  
    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;
  }