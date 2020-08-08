import {
    User, UserStatus, UserAuthInfo, UserAuthType
} from "../entity";
import { hash, genSalt } from "bcrypt";
import { getApp } from "..";
import { StaticController } from "./common";


export class UserController extends StaticController {
    public static async createLocalUser(username: string): Promise<User> {
        const db = getApp().getMainDBManager();

        let userAuth = {
            allowLocalAccess:  UserAuthType.NO_AUTH,
            allowRemoteAccess: UserAuthType.FORBID
        } as Partial<UserAuthInfo>;

        let user = {
            status: UserStatus.NORMAL,
            username
        } as Partial<User>;

        try {
            db.transaction(async (db) => {
                userAuth = await db.save(UserAuthInfo, userAuth);
                user.auth = userAuth as UserAuthInfo;
                user = await db.save(User, user);
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
        return user as User;
    }

    public static async createUser(username: string, password: string, email?: string): Promise<User> {
        const db = getApp().getMainDBManager();

        const salt = await genSalt();
        const passwordHash = await hash(password, salt);

        let userAuth = {
            allowLocalAccess:  UserAuthType.NO_AUTH,
            allowRemoteAccess: UserAuthType.PASSWORD,
            passwordHash,
            passwordUpdatedAt: new Date()
        } as Partial<UserAuthInfo>;

        const lowercaseEmail = email ? email.toLowerCase() : null;
        const displayEmail = email ? email : null;

        let user = {
            username: username,
            status:   UserStatus.NORMAL,
            lowercaseEmail,
            displayEmail,
            auth:     userAuth
        } as Partial<User>;

        try {
            db.transaction(async (db) => {
                userAuth = await db.save(UserAuthInfo, userAuth);
                user.auth = userAuth as UserAuthInfo;
                user = await db.save(User, user);
            });
        } catch (e) {
            console.log(e);
            throw e;
        }
        return user as User;
    }

    public static async listAllUsers(): Promise<User[]> {
        const db = getApp().getMainDBManager();
        return db.find(User);
    }

    public static async findUserByUsername(username: string): Promise<User> {
        const db = getApp().getMainDBManager();
        return db.findOne(User, { username });
    }
}
