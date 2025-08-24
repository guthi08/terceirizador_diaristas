import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from
"typeorm";
import Usuário from "./usuário";
import VagaEmprego from "./vaga-emprego";
export enum Titulação {GA = "Gerente administrativo", GC = "Gerente comercial", GF = "Gerente financeiro" };
@Entity()
export default class GerenteEmpresa extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "enum", enum: Titulação })
    titulação: Titulação;
    @Column()
    telefone: string;
    @Column()
    anos_experiência_empresarial: number;
    @OneToMany(() => VagaEmprego, (vaga_emprego) => vaga_emprego.gerente_empresa)
    vagas_empregos: VagaEmprego[];
    @OneToOne(() => Usuário, (usuário) => usuário.gerente_empresa, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}
