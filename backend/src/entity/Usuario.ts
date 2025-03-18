import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Material } from "./Material";
import { Comentario } from "./Comentario";

export enum Role {
    ADMIN = "admin",
    ESPECIALISTA = "especialista",
    USER = "user",
}

@Entity({ name: "usuarios" })
export class Usuario {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    nome!: string;

    @Column({ unique: true })
    apelido!: string;

    @Column()
    senha!: string;

    @Column({ type: "date", nullable: true })
    data_nascimento!: Date;

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role!: Role;

    // Armazena data/hora de criação
    @CreateDateColumn()
    data_criacao!: Date;

    // Armazena data/hora de última atualização
    @UpdateDateColumn()
    data_atualizacao!: Date;

    // Soft-delete
    @Column({ default: false })
    deletado!: boolean;

    // Data do soft-delete
    @Column({ type: "timestamp", nullable: true })
    data_deletado?: Date;

    // Relacionamento 1:N -> Um usuário pode ter vários materiais
    @OneToMany(() => Material, (material) => material.usuario)
    materiais!: Material[];

    // Relacionamento 1:N -> Um usuário pode ter vários comentários
    @OneToMany(() => Comentario, (comentario) => comentario.usuario)
    comentarios!: Comentario[];
}