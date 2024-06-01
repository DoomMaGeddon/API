import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Usuarios } from "./Usuarios";

@Entity()
export class Entradas {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number = 0;

    @Column({ type: "boolean", nullable: false })
    foto: string = "";

    @Column({ type: "boolean", nullable: false })
    original: boolean = false;

    @OneToMany(_type => Usuarios, usuario => usuario.email)
    creador: Usuarios = new Usuarios();
}