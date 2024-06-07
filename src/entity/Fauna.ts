import { Entity, Column } from "typeorm";
import { Entradas } from "./Entradas";

@Entity()
export class Fauna extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 100, nullable: false })
    especie: string = '';

    @Column({ type: "integer", nullable: false })
    habitat: number = 1;

    @Column({ type: "varchar", length: 50, nullable: false })
    peligro: string = '';

    @Column({ type: "varchar", length: 20, nullable: false })
    dieta: string = '';

    @Column({ type: "text", nullable: false })
    descripcion: string = '';
}
