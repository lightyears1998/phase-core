import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn, ManyToMany, UpdateDateColumn
} from "typeorm";
import { Timespan } from "./Timespan";
import { Attachment } from "./Attachment";
import { Action } from "./Action";
import { User } from "./User";


export enum TargetStatus {
    /** 活跃状态 */
    ACTIVE = "active",

    /** 暂停 */
    SUSPENDED = "suspended",

    /** 专注中 */
    FOCUSING = "focusing",

    /** 完成 */
    COMPLETED = "completed",

    /** 隐藏 */
    HIDDEN = "hidden",

    /** 删除 */
    DELETED = "deleted"
}


@Entity()
export class TargetEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @OneToMany(() => User, user => user.targets)
    public owner: User

    @Column()
    public status: TargetStatus;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column(() => Timespan)
    public timespan: Timespan;

    @OneToMany(() => Action, action => action.target)
    public actions: Action[];

    @OneToMany(() => TargetAttachment, attachment => attachment.filepath)
    public attachments: Attachment[]
}


@Entity()
export class TargetAttachment extends Attachment {
    @ManyToOne(() => TargetEntity, target => target.attachments)
    public attchedTo: TargetEntity
}
