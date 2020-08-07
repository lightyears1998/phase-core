import {
    Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn, ManyToMany
} from "typeorm";
import { Timespan } from "./Timespan";
import { VersionControlEmbbedEntity } from "./VersionControlEntity";
import { Attachment } from "./Attachment";


enum TargetStatus {
    ESTABLISHED = "established",
    SUSPENDED = "suspended",
    COMPLETE = "complete",
    DELETED = "deleted"
}


@Entity()
export class TargetEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @CreateDateColumn()
    public createdAt: Date

    @OneToOne(() => TargetProperties, {
        eager: true
    })
    @JoinColumn()
    public description: TargetProperties;
}


@Entity()
export class TargetAttachment extends Attachment {
    @ManyToOne(() => TargetProperties, target => target.attachments)
    public owner: TargetEntity
}


@Entity()
export class TargetProperties {
    @OneToOne(() => TargetEntity)
    public owner: TargetEntity;

    @Column(() => VersionControlEmbbedEntity)
    public version: VersionControlEmbbedEntity;

    @Column()
    public status: TargetStatus;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    public tiemspan: Timespan;

    @OneToMany(() => Attachment, attachment => attachment.filepath)
    public attachments: Attachment[]
}
