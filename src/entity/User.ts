import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";


export enum UserStatus {
    EMAIL_NOT_VERIFIED = "email_not_verified",
    NORMAL = "normal",
    BLOCKED = "blocked",
    DELETED = "deleted"
}


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public id: string

    @Column()
    public status: UserStatus

    @Column()
    public username: string

    @Column()
    public email: string

    @Column()
    public passwordHash: string
}
