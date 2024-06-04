import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Usuarios {

    @PrimaryColumn({ type: "text", nullable: false })
    email: string = '';

    @Column({ type: "varchar", length: 15, nullable: false })
    nombreUsuario: string = '';

    @Column({ type: "varchar", length: 255, nullable: true })
    fotoPerfil: string = '';

    @Column({ type: "varchar", length: 255, nullable: false })
    contrasenya: string = '';

    @Column({ type: "varchar", length: 255, nullable: true })
    descripcion: string = '';

    @Column({ type: "varchar", length: 255, nullable: false })
    rol: string = '';

    @Column({ type: "integer", nullable: false })
    experiencia: number = 0;

    @Column({ type: "bool", nullable: false })
    notificaciones: boolean = true;

    @Column({ type: "integer", nullable: true })
    rangoId: number | null = null;
}

