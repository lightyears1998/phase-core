import { PrimaryGeneratedColumn, UpdateDateColumn, Column, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";


export enum VersionControlStatus {
    /** 当前生效的版本 */
    VALID = "valid",

    /** 存档的版本 */
    ARCHIVE = "archive"
}


export class VersionControlEmbbedEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn()
    createdAt: Date

    @Column()
    status: VersionControlStatus

    @OneToOne(() => VersionControlEmbbedEntity, {
        nullable: true
    })
    @JoinColumn()
    public previousVersion: VersionControlEmbbedEntity;
}
