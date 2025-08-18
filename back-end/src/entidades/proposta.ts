import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Professor from "./professor";
import Interesse from "./interesse";
export enum Categoria { EXTENSÃO = "Extensão", IC = "Iniciação Científica", TCC = "TCC" };
export enum Resultado { ARTIGO = "artigo", DESENVOLVIMENTO = "desenvolvimento", MONOGRAFIA =
"monografia" };
@Entity()
export default class Proposta extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 título: string;
@Column({ type: "enum", enum: Categoria })
 categoria: Categoria;
 @Column()
 área_atuação: string;
 @Column({ type: "date" })
 data_início: Date;
 @Column()
 descrição: string;
 @Column()
 concorrendo_bolsa: boolean;
 @Column({ type: "enum", enum: Resultado })
 resultado: Resultado;
 @ManyToOne(() => Professor, (professor) => professor.propostas, { onDelete: "CASCADE" })
 professor: Professor;
 @OneToMany(() => Interesse, (interesse) => interesse.proposta)
 interesses: Interesse[];
}
