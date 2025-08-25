import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Interesse from "./interesse";
import GerenteEmpresa from "./gerente-empresa";

export enum Dia_trabalho { segunda_feira = "Segunda-feira", terça_feira = "Terça-feira", quarta_feira = "Quarta-feira",
quinta_feira = "Quinta-feira", sexta_feira = "Sexta-feira", sábado = "Sábado", domingo = "Domingo" };
export enum Turno_trabalho { matutino = "Matutino", vespertino = "Vespertino", noturno = "Noturno" };

@Entity()
export default class VagaEmprego extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: Dia_trabalho })
    dia_trabalho: Dia_trabalho;

    @Column({ type: "enum", enum: Turno_trabalho })
    turno_trabalho: Turno_trabalho;
    
    @Column()
    salário: number;
    
    @Column()
    descrição: string;

    @Column()
    urgência: boolean;

    @ManyToOne(() => GerenteEmpresa, (gerente_empresa) => gerente_empresa.vagas_empregos, { onDelete: "CASCADE" })
    gerente_empresa: GerenteEmpresa[];

    @OneToMany(() => Interesse, (interesse) => interesse.vaga_emprego)
    interesses: Interesse[];
    }