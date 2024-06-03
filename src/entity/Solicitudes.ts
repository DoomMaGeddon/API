import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Solicitudes {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number = 0;

    @Column({ type: "text", nullable: false })
    emailUsuario: string = '';

    @Column({ type: "date", nullable: false })
    fecha: Date = new Date();

    @Column({ type: "text", nullable: false })
    descripcion: string = '';
}
