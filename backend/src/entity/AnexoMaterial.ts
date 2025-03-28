import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Material } from "./Material";
  
  @Entity({ name: "anexos_material" })
  export class AnexoMaterial {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
  
    @ManyToOne(() => Material, (material) => material.anexos, { onDelete: "CASCADE" }) 
    @JoinColumn({ name: "material_id" })   
    material!: Material;
  
    @Column({ name: "arquivo_url" })  
    arquivo_url!: string;
  
    @Column({ name: "arquivo_type" })  
    arquivo_type!: string;
  }