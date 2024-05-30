import { Entity, Column, JoinColumn, OneToOne } from "typeorm";
import { Entradas } from "./Entradas";
import { Exploradores } from "./Exploradores";

@Entity()
export class GruposExploradores extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 50, nullable: false })
    estado: string = '';

    @Column({ type: "text", nullable: false })
    rango: string = '';

    @OneToOne(_type => Exploradores) @JoinColumn()
    lider: Exploradores = new Exploradores();
}
