import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { Usuario } from "./Usuario";
import { Comentario } from "./Comentario";
import { AnexoMaterial } from "./AnexoMaterial";
import { Like } from "./Like";
import { Categoria } from "./Categoria";

@Entity({ name: "materiais" })
export class Material {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  titulo!: string;

  @Column({ type: "text" })
  descricao!: string;

  @ManyToOne(() => Categoria, { onDelete: "SET NULL" })  // Relacionamento com a tabela Categoria
  @JoinColumn({ name: "categoria_id" })
  categoria!: Categoria;

  @Column({ type: "text" })
  conteudo!: string;

  @Column({ default: "analise" })
  flag!: string;

  @Column({ nullable: true })
  thumbnail_url?: string;

  @Column({ type: "date", nullable: true })
  data_aprovacao!: Date | null;

  @CreateDateColumn()
  data_criacao!: Date;

  @UpdateDateColumn()
  data_atualizacao!: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.materiais, { onDelete: "CASCADE" })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;

  @DeleteDateColumn({ name: "data_deletado" })
  data_deletado!: Date | null;

  @OneToMany(() => Comentario, (comentario) => comentario.material)
  comentarios!: Comentario[];

  @OneToMany(() => AnexoMaterial, (anexo) => anexo.material)
  anexos!: AnexoMaterial[];

  @OneToMany(() => Like, (like) => like.material)
  likes!: Like[];
}