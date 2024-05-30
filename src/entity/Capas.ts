import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Rangos } from "./Rangos";

@Entity()
export class Capas {
    @PrimaryColumn({ type: "integer", nullable: false })
    numero: number = 0;

    @Column({ type: "varchar", length: 50, nullable: false })
    nombre: string = '';

    @ManyToOne(_type => Rangos)
    rango: Rangos = new Rangos();
}