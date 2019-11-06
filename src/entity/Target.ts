import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Target extends BaseEntity {
    @Column() summary: string
}
