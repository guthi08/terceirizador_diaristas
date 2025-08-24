import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GerenteEmpresa from "./gerente-empresa";
import Interesse from "./interesse";
export enum dia_trabalho { sf = "Segunda-feira", tf = "terça-feira", qf = "Quarta-feira", qtf = "Quinta-feira",
 stf = "Sexta-feira", ss = "Sábado", ds = "Domingo" };

@Entity()
export default class VagaEmprego extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    título: string;

    @Column({ type: "enum", enum: dia_trabalho })
    categoria: dia_trabalho;

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
