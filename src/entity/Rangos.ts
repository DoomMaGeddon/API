import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rangos {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number = 0;

    @Column({ type: "varchar", length: 15, nullable: false })
    nombre: string = '';

    @Column({ type: "integer", nullable: false })
    requisito: number = 0;
}
