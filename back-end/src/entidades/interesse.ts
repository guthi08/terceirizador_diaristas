import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
"typeorm";
import Diarista from "./diarista";
import VagaEmprego from "./vaga-emprego";
export enum dia_interesse { SEGUNDA = "Segunda-feira", TERÇA = "terça-feira", QUARTA = "Quarta-feira", QUINTA = "Quinta-feira",
 SEXTA = "Sexta-feira", SÁBADO = "Sábado", DOMINGO = "Domingo" };
export enum turnos_interesse { MANHÃ = "Vatutino", TARDE = "Vespertino", NOITE = "Noturno" };

@Entity()
export default class Interesse extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    prontidão: boolean;

    @Column({ type: "enum", enum: dia_interesse })
    dia_preferido: dia_interesse;

    @Column({ type: "enum", enum: turnos_interesse })
    turno_preferido: turnos_interesse;

    @ManyToOne(() => VagaEmprego, (vaga_emprego) => vaga_emprego.interesses, { onDelete: "CASCADE" })
    vaga_emprego: VagaEmprego;

    @ManyToOne(() => Diarista, (diarista) => diarista.interesses, { onDelete: "CASCADE" })
    diarista: Diarista;
    }