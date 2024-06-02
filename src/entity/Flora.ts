import { Entity, Column } from "typeorm";
import { Entradas } from "./Entradas";

@Entity()
export class Flora extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 100, nullable: false })
    especie: string = '';

    @Column({ type: "integer", nullable: false })
    habitat: number = 1;

    @Column({ type: "text", nullable: false })
    descripcion: string = '';
}
