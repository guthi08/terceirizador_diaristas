import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
"typeorm";
import Aluno from "./aluno";
import Proposta from "./proposta";
@Entity()
export default class Interesse extends BaseEntity {
@PrimaryGeneratedColumn()
 id: number;
 @Column()
 necessidade_bolsa: boolean;
 @Column()
 justificativa: string;
 @CreateDateColumn()
 data_manifestação: Date;
 @ManyToOne(() => Proposta, (proposta) => proposta.interesses, { onDelete: "CASCADE" })
 proposta: Proposta;
 @ManyToOne(() => Aluno, (aluno) => aluno.interesses, { onDelete: "CASCADE" })
 aluno: Aluno;
}