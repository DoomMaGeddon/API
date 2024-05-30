import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { Usuarios } from "./Usuarios";

@Entity()
export class Solicitudes {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number = 0;

    @OneToOne(_type => Usuarios) @JoinColumn()
    emailUsuario: Usuarios = new Usuarios();

    @Column({ type: "date", nullable: false })
    fecha: Date = new Date();

    @Column({ type: "text", nullable: false })
    descripcion: string = '';
}
