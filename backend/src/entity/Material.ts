import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Comentario } from "./Comentario";

export enum Flag {
    APROVADO = "aprovado",
    REPROVADO = "reprovado",
    ANALISE = "analise",
}


@Entity({ name: "materiais" })
export class Material {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    descricao!: string;

    @Column()
    categoria!: string;

    @Column()
    conteudo!: string;

    @Column({ type: "enum", enum: Flag, default: Flag.ANALISE })
    flag!: Flag;

    @Column({ type: "date", nullable: true })
    data_aprovacao!: Date;

    @CreateDateColumn()
    data_criacao!: Date;

    @UpdateDateColumn()
    data_atualizacao!: Date;

    @DeleteDateColumn({ name: "data_deletado" })
    data_deletado!: Date | null;

    // Muitos materiais pertencem a um usuário (N:1)
    @ManyToOne(() => Usuario, (usuario) => usuario.materiais)
    usuario!: Usuario;

    // Um material pode ter vários comentários (1:N)
    @OneToMany(() => Comentario, (comentario) => comentario.material)
    comentarios!: Comentario[];
}