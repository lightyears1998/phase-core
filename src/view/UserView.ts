import {
    View, RouterView, Route
} from "./common";
import {
    prompt, InputQuestion, ConfirmQuestion, PasswordQuestion
} from "inquirer";
import { User } from "../entity";


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
            shouldCreatePassword = "shouldCreatePassword",
            password = "password"
        }

        const validateUsername = (inputUsername: string) => {
            const result = User.validateUsername(inputUsername);
            if (result instanceof Error) {
                return result.message;
            }
            return true;
        };

        const questions = [
            {
                name:     answerKeys.username,
                type:     "input",
                message:  "请输入用户名",
                validate: validateUsername
            } as InputQuestion,
            {
                name:    answerKeys.shouldCreatePassword,
                type:    "confirm",
                message: "要创建密码吗？有密码的账户可以远程登录。"
            } as ConfirmQuestion,
            {
                name:    answerKeys.password,
                type:    "password",
                message: "请输入密码",
                when:    (ans) => ans[answerKeys.shouldCreatePassword]
            } as PasswordQuestion
        ];

        const input = await prompt(questions);
        console.log(input);
    }
}


export class SwitchUserView extends View {
    public async invoke(): Promise<void> {
        // @TODO
    }
}
