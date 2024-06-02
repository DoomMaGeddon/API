import { Entity, Column } from "typeorm";
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

    @Column({ type: "integer", nullable: true })
    duenyoId: number | null = null;
}

