import {
    Column, Entity, CreateDateColumn, PrimaryGeneratedColumn
} from "typeorm";
import { TargetEntity } from "./Target";


export class TargetWeight {
    @Column("simple-json")
    public target: TargetEntity

    @Column({ nullable: true })
    public percentageWeight?: number
}


/**
 * 平衡计划
 */
@Entity()
export class BalancePlanEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public name: string

    @CreateDateColumn()
    public createdAt: Date

    @Column("simple-json")
    public targetWeights: Array<TargetWeight>

    @Column()
    public isValid: boolean
}
