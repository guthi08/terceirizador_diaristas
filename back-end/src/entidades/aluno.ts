import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
 from "typeorm";
import Usuário from "./usuário";
import Interesse from "./interesse";
export enum Curso { EC = "Engenharia de Computação", SI = "Sistemas de Informação" };
@Entity()
export default class Aluno extends BaseEntity {
@PrimaryGeneratedColumn()
 id: number;
 @Column({ type: "enum", enum: Curso })
 curso: Curso;
 @Column()
 ano_ingresso: number;
 @Column({ type: "date" })
 data_nascimento: Date;
 @Column()
 telefone: string;
 @OneToMany(() => Interesse, (interesse) => interesse.aluno)
 interesses: Interesse[];
 @OneToOne(() => Usuário, usuário => usuário.aluno, { onDelete: "CASCADE" })
 @JoinColumn()
 usuário: Usuário;
}
