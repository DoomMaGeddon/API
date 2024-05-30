import { Entity, Column, ManyToOne } from "typeorm";
import { Exploradores } from "./Exploradores";
import { Entradas } from "./Entradas";

@Entity()
export class Artefactos extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "text", nullable: false })
    grado: string = '';

    @Column({ type: "text", nullable: false })
    efecto: string = '';

    @Column({ type: "text", nullable: false })
    descripcion: string = '';

    @Column({ type: "text", nullable: false })
    origen: string = '';

    @ManyToOne(_type => Exploradores)
    duenyo: Exploradores = new Exploradores();
}

