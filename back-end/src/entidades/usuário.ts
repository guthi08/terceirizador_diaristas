import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import GerenteEmpresa from "./gerente-empresa";
import Diarista from "./diarista";
export enum Perfil { DIARISTA = "diarista", GERENTE_EMPRESA= "gerente" };
export enum Status { PENDENTE = "pendente", ATIVO = "ativo" };
export enum Cores { AMARELO = "yellow", ANIL = "indigo", AZUL = "blue", AZUL_PISCINA = "cyan",
 CINZA_ESCURO = "bluegray", LARANJA = "orange", ROSA = "pink", ROXO = "purple", VERDE = "green",
 VERDE_AZULADO = "teal" };
@Entity()
export default class Usuário extends BaseEntity {
    @PrimaryColumn()
    cpf: string;

    @Column({type: "enum", enum: Perfil })
    perfil: Perfil;

    @Column({type: "enum", enum: Status, default: Status.PENDENTE })
    status: Status;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column()
    questão: string;

    @Column()
    resposta: string;

    @Column({ type: "enum", enum: Cores })
    cor_tema: string;

    @OneToOne(() => GerenteEmpresa, (gerente_empresa) => gerente_empresa.usuário)
    gerente_empresa: GerenteEmpresa;

    @OneToOne(() => Diarista, (diarista) => diarista.usuário)
    diarista: Diarista;

    @CreateDateColumn()
    data_criação: Date;
}
