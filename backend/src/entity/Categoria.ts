import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn
} from "typeorm";
import { Material } from "./Material";

@Entity({ name: "categorias" })
export class Categoria {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    nome!: string;

    @Column()
    descricao!: string;

    @CreateDateColumn()
    data_criacao!: Date;

    @OneToMany(() => Material, (material) => material.categoria)
    materiais!: Material[];
}