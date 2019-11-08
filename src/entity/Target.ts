import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { BasicAttributes } from "./BasicAttributes";


enum TargetStatus {
    ESTABLISHED = "established",
    SUSPENDED = "suspended",
    COMPLETE = "complete",
    DELETED = "deleted"
}


@Entity()
export class Target  {
    @Column() order: number
    @Column() summary: string
    @Column() detail: string
}
