import {
    Entity, PrimaryGeneratedColumn, Column
} from "typeorm";


export enum UserAuthType {
    /** 无需验证直接放行 */
    NO_AUTH = "no_auth",

    /**
     * 使用密码进行验证
     *
     * - 若未设置密码，则验证不通过。
     */
    PASSWORD = "password",

    /** 禁止登录 */
    FORBID = "forbit"
}


/**
 * 用户凭证相关
 */
@Entity()
export class UserAuthInfo {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    allowLocalAccess: UserAuthType

    @Column()
    allowRemoteAccess: UserAuthType

    @Column({ nullable: true })
    passwordHash: string

    @Column({ nullable: true })
    passwordUpdatedAt: Date
}
