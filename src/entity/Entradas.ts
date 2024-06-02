import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entradas {
    @PrimaryGeneratedColumn({ type: "integer" })
    id: number = 0;

    @Column({ type: "text", nullable: true })
    foto: string = "";

    @Column({ type: "boolean", nullable: false })
    original: boolean = false;

    @Column({ type: "text", nullable: true })
    creadorEmail: string | null = null;
}