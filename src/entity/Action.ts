import {
    Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Timespan } from "./Timespan";


export enum ActionStatus {
    ESTABLISHED = "established",
    SUSPENDED = "suspended",
    COMPLETE = "complete",
    DELETED = "deleted"
}


@Entity()
export class Action {
    @PrimaryGeneratedColumn("uuid") id: string;
    @CreateDateColumn() createAt: Date;
    @UpdateDateColumn() updateAt: Date;
    @Column(() => Timespan) time: Timespan;
    @Column() status: ActionStatus;
    @Column() order: number
    @Column() summary: string
    @Column() detail: string
}
