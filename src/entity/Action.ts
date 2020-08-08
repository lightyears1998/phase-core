import {
    Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany
} from "typeorm";
import { Timespan } from "./Timespan";
import { TargetEntity } from "./Target";
import { User } from "./User";
import { Attachment } from "./Attachment";


export enum ActionStatus {
    /** 待计划 */
    NOT_PLANNED = "not-planned",

    /** 已计划 */
    PLANNED = "planned",

    /** 行动完成 */
    COMPLETED = "completed",

    /** 行动中断 */
    INTERRUPTED = "interrupted",

    /** 行动失败 */
    FAILED = "failed",

    /** 已删除 */
    DELETED = "deleted"
}


@Entity()
export class Action {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @ManyToOne(() => User, user => user.actions)
    public owner: User;

    @ManyToOne(() => TargetEntity, target => target.actions, { nullable: true })
    public target: TargetEntity;

    @Column()
    public name: string

    @Column()
    public description: string

    @Column(() => Timespan)
    public time: Timespan;

    @Column()
    public status: ActionStatus;

    @OneToMany(() => ActionAttachment, attachment => attachment.attchedTo)
    public attachments: ActionAttachment[]
}


@Entity()
export class ActionAttachment extends Attachment {
    @ManyToOne(() => Action, action => action.attachments)
    public attchedTo: Action
}
