import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
"typeorm";


import Diarista from "./diarista";
import VagaEmprego from "./vaga-emprego";

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

    @ManyToOne(() => VagaEmprego, (vaga_emprego) => vaga_emprego.interesses, { onDelete: "CASCADE" })
    vaga_emprego: VagaEmprego;

    @ManyToOne(() => Diarista, (diarista) => diarista.interesses, { onDelete: "CASCADE" })
    diarista: Diarista;
}