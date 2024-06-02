import { Entity, Column } from "typeorm";
import { Entradas } from "./Entradas";

@Entity()
export class Exploradores extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 10, nullable: false })
    genero: string = '';

    @Column({ type: "varchar", length: 100, nullable: false })
    especie: string = '';

    @Column({ type: "varchar", length: 50, nullable: false })
    estado: string = '';

    @Column({ type: "integer", nullable: true })
    rangoId: number | null = null;
}
