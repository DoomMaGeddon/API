import { Entity, Column } from "typeorm";
import { Entradas } from "./Entradas";

@Entity()
export class GruposExploradores extends Entradas {

    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string = '';

    @Column({ type: "varchar", length: 50, nullable: false })
    estado: string = '';

    @Column({ type: "text", nullable: false })
    rango: string = '';

    @Column({ type: "integer", nullable: false })
    liderId: number = 0;
}
