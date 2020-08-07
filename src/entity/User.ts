import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Unique, OneToMany
} from "typeorm";
import { UserAuthInfo } from ".";
import validator from "validator";
import { TargetEntity } from "./Target";
import { Action } from "./Action";


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


export class UsernameEmptyError extends Error {
    message = "用户名不能为空。"
}


export class UsernameStartsOrEndsWithWhitespaceError extends Error {
    message = "用户名不能以空白字符开始或结尾。"
}


export class UsernameTooShortError extends Error {
    message = "用户名不能短于 2 字符。"
}


export class UsernameTooLongError extends Error {
    message = "用户名不得长于 32 字符。"
}


export class UsernameContainsInvalidCharaterError extends Error {
    message = "用户名不能含有特殊字符。"
}


@Entity()
@Unique("unique_username", ["username"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    public id: string

    @Column()
    public username: string

    @Column()
    public status: UserStatus

    /** 全小写的邮箱 */
    @Column({ nullable: true })
    public lowercaseEmail?: string

    /** 显示邮箱 */
    @Column({ nullable: true })
    public displayEmail?: string

    @OneToOne(() => UserAuthInfo)
    @JoinColumn()
    public auth: UserAuthInfo;

    @OneToMany(() => TargetEntity, target => target.owner)
    public targets: TargetEntity[]

    @OneToMany(() => Action, action => action.owner)
    public actions: Action[]

    /**
     * - 用户名不能为空字符串。
     * - 用户名不得以空白字符开头或结尾。
     * - 用户名中不短于 2 字符，不长于 32 字符。
     * - 用户名中不得含有以下特殊字符之一：^ ~ ! @ : / \ < > " | * ? $ '\u0000'
     *
     * @param username 待检验的用户名
     */
    public static validateUsername(username: string): boolean | Error {
        if (username !== username.trim()) {
            return new UsernameStartsOrEndsWithWhitespaceError();
        }

        if (username === "") {
            return new UsernameEmptyError();
        }

        if (username.length < 2) {
            return new UsernameTooShortError();
        } else if (username.length > 32) {
            return new UsernameTooLongError();
        }

        if (username.match(/^[^^~!@:/\\><"|*?$\0]*$/)) {
            return true;
        }
        return new UsernameContainsInvalidCharaterError();
    }

    public static validateEmail(email: string): boolean {
        return validator.isEmail(email);
    }
}
