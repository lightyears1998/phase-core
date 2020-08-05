import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, getManager
} from "typeorm";
import { UserAuth, AuthType } from ".";


/**
 * 用户状态
 *
 * 在 App 运行过程中，一些用户可能会被封禁。
 */
export enum UserStatus {
    /** 邮箱地址未验证 */
    EMAIL_NOT_VERIFIED = "email_not_verified",

    /** 正常 */
    NORMAL = "normal",

    /** 封禁 */
    BLOCKED = "blocked",
}


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    public id: string

    @Column()
    public username: string

    @Column()
    public status: UserStatus

    @Column({ nullable: true })
    public email?: string

    @OneToOne(() => UserAuth)
    @JoinColumn()
    public auth: UserAuth;

    public static async createLocalUser(username: string): Promise<User> {
        const db = getManager();

        const userAuth = {
            allowLocalAccess: AuthType.NO_AUTH,
            allowRemoteAccess: AuthType.FORBID,
        } as Partial<UserAuth>;

        const user = {
            status: UserStatus.NORMAL,
            username,
            auth: userAuth
        } as Partial<User>

        return await db.save(user) as User;
    }

    public static async createUser(username: string, email: string, password: string): Promise<User> {
        return;
    }
}
