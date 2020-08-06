import {
    View, RouterView, Route
} from "./common";
import {
    prompt, InputQuestion, ConfirmQuestion, PasswordQuestion
} from "inquirer";
import { User } from "../entity";
import { UserController } from "../control";
import PasswordPrompt = require("inquirer/lib/prompts/password");


export class UserView extends RouterView {
    protected choices = [
        new Route("切换用户", new SwitchUserView()),
        new Route("新建用户", new CreateUserView()),
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
        }

        const validateEmail = (inputEmail: string) => {
            return inputEmail.trim() === "" || User.validateEmail(inputEmail);
        }

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
                name:    answerKeys.password,
                type:    "password",
                mask: "*",
                message: "请输入密码",
                when:    (ans) => ans[answerKeys.shouldCreateRemoteAccess],
                validate: validatePassword
            } as PasswordQuestion,
            {
                name: answerKeys.email,
                type: "input",
                message: "请输入邮箱地址（可选）",
                when: (ans) => ans[answerKeys.shouldCreateRemoteAccess],
                validate: validateEmail
            }
        ];

        const userInput = await prompt<Record<answerKeys, string>>(questions);
        if (userInput.password) {
            UserController.createUser(userInput.username.trim(), userInput.password, userInput.email.trim());
        } else {
            UserController.createLocalUser(userInput.username.trim())
        }
    }
}


export class SwitchUserView extends View {
    public async invoke(): Promise<void> {
        const users = await UserController.listAllUsers();
        console.table(users);
    }
}
