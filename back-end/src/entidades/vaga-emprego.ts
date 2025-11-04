import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import GerenteEmpresa from "./gerente-empresa";
import Interesse from "./interesse";
export enum Dia_trabalho { SEGUNDA = "segunda", TERÇA = "terça", QUARTA = "quarta", QUINTA = "quinta", SEXTA = "sexta",
  SÁBADO = "sábado", DOMINGO = "domingo"};
export enum Turno_trabalho { VESPERTINO = "vespertino", NOTURNO = "noturno", INTEGRAL = "integral" };


@Entity()
export default class VagaEmprego extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Dia_trabalho })
  dia_trabalho: Dia_trabalho;

  @Column({ type: "enum", enum: Turno_trabalho })
  turno_trabalho: Turno_trabalho;

  @Column()
  descrição: string;

  @Column()
  salário: number;
  
  @Column()
  urgência: boolean;
  
  @ManyToOne(() => GerenteEmpresa, (gerente_empresa) => gerente_empresa.vagas_emprego, { onDelete: "CASCADE" })//um gerenete pode oferencer várias vagas
  gerente_empresa: GerenteEmpresa;

  @OneToMany(() => Interesse, (interesse) => interesse.vaga_emprego)
  interesses: Interesse[];
}