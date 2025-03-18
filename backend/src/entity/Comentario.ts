import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Material } from "./Material";

@Entity({ name: "comentarios" })
export class Comentario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    conteudo!: string;

    @CreateDateColumn()
    data_criacao!: Date;

    @UpdateDateColumn()
    data_atualizacao!: Date;

    // Muitos comentários pertencem a um usuário (N:1)
    @ManyToOne(() => Usuario, (usuario) => usuario.comentarios)
    usuario!: Usuario;

    // Muitos comentários pertencem a um material (N:1)
    @ManyToOne(() => Material, (material) => material.comentarios)
    material!: Material;
}