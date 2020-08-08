import {
    View, RouterView, Route
} from "./common";
import {
    prompt, InputQuestion, ConfirmQuestion, PasswordQuestion
} from "inquirer";
import { User } from "../entity";
import { UserController } from "../control";
import * as fuzzy from "fuzzy";
import { getApp } from "..";


export class UserView extends RouterView {
    protected choices = [
        new Route("切换用户", new SwitchUserView()),
        new Route("新建用户", new CreateUserView()),
        getApp().getCurrentUser() ? new Route("退出当前用户", new LogoutUserView()) : null,
        new Route("返回主菜单", null)
    ]
}


export class CreateUserView extends View {
    public async invoke(): Promise<void> {
        enum answerKeys {
            username = "username",
            shouldCreateRemoteAccess = "shouldCreateRemoteAccess",
            password = "password",
            email = "email"
        }

        const validateUsername = (inputUsername: string) => {
            const result = User.validateUsername(inputUsername);
            if (result instanceof Error) {
                return result.message;
            }
            return true;
        };

        const validatePassword = (inputPassword: string) => {
            return !(inputPassword.length === 0);
        };

        const validateEmail = (inputEmail: string) => {
            return inputEmail.trim() === "" || User.validateEmail(inputEmail);
        };

        const questions = [
            {
                name:     answerKeys.username,
                type:     "input",
                message:  "请输入用户名",
                validate: validateUsername
            } as InputQuestion,
            {
                name:    answerKeys.shouldCreateRemoteAccess,
                type:    "confirm",
                message: "要为账户启用远程登录吗？"
            } as ConfirmQuestion,
            {
                name:     answerKeys.password,
                type:     "password",
                mask:     "*",
                message:  "请输入密码",
                when:     (ans) => ans[answerKeys.shouldCreateRemoteAccess],
                validate: validatePassword
            } as PasswordQuestion,
            {
                name:     answerKeys.email,
                type:     "input",
                message:  "请输入邮箱地址（可选）",
                when:     (ans) => ans[answerKeys.shouldCreateRemoteAccess],
                validate: validateEmail
            }
        ];

        const userInput = await prompt<Record<answerKeys, string>>(questions);
        if (userInput.password) {
            UserController.createUser(userInput.username.trim(), userInput.password, userInput.email.trim());
        } else {
            UserController.createLocalUser(userInput.username.trim());
        }
    }
}


export class SwitchUserView extends View {
    public async invoke(): Promise<void> {
        const users = await UserController.listAllUsers();

        const choices = users.map(user => {
            return user.displayEmail ? `${user.username} <${user.displayEmail}>` : user.username;
        });

        const searchChoices = (_: unknown, input: string | undefined) => {
            input = input || "";
            return new Promise((resolve) => {
                const result = fuzzy.filter(input, choices);
                resolve(result.map(item => item.original));
            });
        };

        enum answerKeys {
            SELECTED_USER = "selected_user",
            COMFIRM_SWITCH_USER = "comfirm_switch_user"
        }

        const answers = await prompt([
            {
                type:    "autocomplete",
                name:    answerKeys.SELECTED_USER,
                message: "选择用户身份",
                source:  searchChoices
            },
            {
                type:    "confirm",
                name:    answerKeys.COMFIRM_SWITCH_USER,
                message: (ans) => {
                    return `确认切换到用户 ${ans[answerKeys.SELECTED_USER]} 吗？`;
                }
            } as ConfirmQuestion
        ]);

        if (answers[answerKeys.COMFIRM_SWITCH_USER]) {
            // username 形如 "lightyears <lightyears@qfstudio.net>" 或 "lightyears"
            const username = (answers[answerKeys.SELECTED_USER] as string).split("<")[0].trim();
            const user = await UserController.findUserByUsername(username);
            if (user) {
                await getApp().loginUser(user);
                console.log(`切换为 ${user.username}`);
            } else {
                console.log("无法切换到该用户，因为该用户不存在。");
            }
        }
    }
}


export class LogoutUserView extends View {
    public async invoke(): Promise<void> {
        const answerKey = "confirm";

        const answer = await prompt([
            {
                type:    "confirm",
                name:    answerKey,
                message: "要退出登录当前用户吗？"
            }
        ]);

        if (answer[answerKey]) {
            await getApp().logoutUser();
        }
    }
}
