import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    DeleteDateColumn,
    JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Material } from "./Material";

@Entity({ name: "comentarios" })
export class Comentario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text" })
    conteudo!: string;

    @CreateDateColumn()
    data_criacao!: Date;

    @UpdateDateColumn()
    data_atualizacao!: Date;

    @ManyToOne(() => Usuario, (usuario) => usuario.comentarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "usuario_id" })  
    usuario!: Usuario;

    @ManyToOne(() => Material, (material) => material.comentarios, { onDelete: "CASCADE" })
    @JoinColumn({ name: "material_id" })  
    material!: Material;

    @DeleteDateColumn({ name: "data_deletado" })
    data_deletado!: Date | null;
}