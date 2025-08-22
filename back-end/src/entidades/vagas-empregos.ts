import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GerenteEmpresa from "./gerente-empresa";
import Interesse from "./interesse";
export enum Categoria { EXTENSÃO = "Extensão", IC = "Iniciação Científica", TCC = "TCC" };
export enum Resultado { ARTIGO = "artigo", DESENVOLVIMENTO = "desenvolvimento", MONOGRAFIA =
"monografia" };
@Entity()
export default class VagaEmprego extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 título: string;
@Column({ type: "enum", enum: Categoria })
 categoria: Categoria;
 @Column()
 área_atuação: string;
 @Column()
 descrição: string;
 @Column()
 salário: number;
 @Column()
 urgênia: boolean;
 @ManyToOne(() => GerenteEmpresa, (gerente_empresa) => gerente_empresa.vagas_empregos, { onDelete: "CASCADE" })
 gerente_empresa: GerenteEmpresa;
 @OneToMany(() => Interesse, (interesse) => interesse.vaga_emprego)
 interesses: Interesse[];
}
