import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Time } from "./Time";


enum TargetStatus {
    ESTABLISHED = "established",
    SUSPENDED = "suspended",
    COMPLETE = "complete",
    DELETED = "deleted"
}


@Entity()
export class Target {
    @PrimaryGeneratedColumn("uuid") id: string;
    @CreateDateColumn() createAt: Date;
    @UpdateDateColumn() updateAt: Date;
    @Column(() => Time) time: Time;
    @Column() status: TargetStatus;
    @Column() order: number
    @Column() summary: string
    @Column() detail: string
}
