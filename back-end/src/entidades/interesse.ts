
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 
"typeorm";
import Diarista from "./diarista";
import VagaEmprego from "./vaga-emprego";
export enum Dia_trabalho { SEGUNDA = "segunda", TERÇA = "terça", QUARTA = "quarta", QUINTA = "quinta", SEXTA = "sexta",
  SÁBADO = "sábado", DOMINGO = "domingo"};
export enum Turno_intersse { MANHÃ = "manhã", TARDE = "tarde", NOITE = "noite" };
@Entity()
export default class Interesse extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Dia_trabalho })
  dia_trabalho: Dia_trabalho;

  @Column()
  justificativa: string;

  @Column()
  prontidão: boolean;
  @Column({ type: "enum", enum: Turno_intersse })
  turno: Turno_intersse;
  @Column()
  valor_diária: number;
  @CreateDateColumn()
  data_manifestação: Date;
  @ManyToOne(() => VagaEmprego, (vaga_emprego) => vaga_emprego.interesses, { onDelete: "CASCADE" }) //uma vaga emprego pode ter várias intersses
  vaga_emprego: VagaEmprego;

  @ManyToOne(() => Diarista, (diarista) => diarista.interesses, { onDelete: "CASCADE" })
  diarista: Diarista;
}