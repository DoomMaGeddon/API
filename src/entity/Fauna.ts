import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Entradas } from "./Entradas";
import { Capas } from "./Capas";

@Entity()
export class Fauna extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 100, nullable: false })
    especie: string = '';

    @ManyToMany(_type => Capas) @JoinTable()
    habitat: Capas = new Capas();

    @Column({ type: "varchar", length: 10, nullable: false })
    peligro: string = '';

    @Column({ type: "varchar", length: 20, nullable: false })
    dieta: string = '';

    @Column({ type: "text", nullable: false })
    descripcion: string = '';
}
