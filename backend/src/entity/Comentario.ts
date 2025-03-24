import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    DeleteDateColumn,
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
    usuario!: Usuario;

    @ManyToOne(() => Material, (material) => material.comentarios, { onDelete: "CASCADE" })
    material!: Material;

    @DeleteDateColumn({ name: "data_deletado" })
    data_deletado!: Date | null;
}