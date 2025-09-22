import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
  from "typeorm";
import Usuário from "./usuário";
import Interesse from "./interesse";
export enum Área_atuação { TÉCNICO = "técnico", GARÇOM = "garçom", CAIXA = "caixa", SERVIÇOS_GERAIS = "serviços gerais"}

@Entity()
export default class Diarista extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: Área_atuação })
  área_atuação: Área_atuação;

  @Column()
  tempo_experiência_área: number;

  @Column({ type: "date" })
  data_nascimento: Date;

  @OneToMany(() => Interesse, (interesse) => interesse.diarista)
  interesses: Interesse[];

  @OneToOne(() => Usuário, usuário => usuário.diarista, { onDelete: "CASCADE" })
  @JoinColumn()
  usuário: Usuário;
}