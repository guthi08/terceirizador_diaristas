import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
 from "typeorm";
import Usuário from "./usuário";
import Interesse from "./interesse";
export enum ÁreaAtuação { TC = "Técnico", GR= "Garçom", CA= "Caixa", SG= "Serviçoes gerais" };

@Entity()
export default class Diarista extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "enum", enum: ÁreaAtuação })
    área_atuação: ÁreaAtuação;
    @Column({ type: "date" })
    data_nascimento: Date;
    @Column()
    tempo_experiência_área: number;
    @Column()
    telefone: string;
    @OneToMany(() => Interesse, (interesse) => interesse.diarista)
    interesses: Interesse[];
    @OneToOne(() => Usuário, usuário => usuário.diarista, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}
