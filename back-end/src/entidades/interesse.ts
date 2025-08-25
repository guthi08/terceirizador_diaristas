import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from
"typeorm";


import Diarista from "./diarista";
import VagaEmprego from "./vaga-emprego";

export enum Dia_interesse { segunda_feira = "Segunda-feira", terça_feira = "Terça-feira", quarta_feira = "Quarta-feira",
quinta_feira = "Quinta-feira", sexta_feira = "Sexta-feira", sábado = "Sábado", domingo = "Domingo" };

export enum turno_interesse { matutino = "Matutino", vespertino = "Vespertino", noturno = "Noturno" };

@Entity()
export default class Interesse extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column( { type: "enum", enum: Dia_interesse })
    dia_interesse: Dia_interesse;

    @Column( { type: "enum", enum: turno_interesse })
    turno_interesse: turno_interesse;

    @Column()
    prontidão: boolean;

    @Column()
    valor_diária: number;

    @ManyToOne(() => VagaEmprego, (vaga_emprego) => vaga_emprego.interesses, { onDelete: "CASCADE" })
    vaga_emprego: VagaEmprego;

    @ManyToOne(() => Diarista, (diarista) => diarista.interesses, { onDelete: "CASCADE" })
    diarista: Diarista;
}