import { Entity, Column, JoinTable, ManyToMany } from "typeorm";
import { Entradas } from "./Entradas";
import { Capas } from "./Capas";

@Entity()
export class Flora extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 100, nullable: false })
    especie: string = '';

    @ManyToMany(_type => Capas) @JoinTable()
    habitat: Capas = new Capas();

    @Column({ type: "text", nullable: false })
    descripcion: string = '';
}
