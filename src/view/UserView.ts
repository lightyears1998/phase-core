import {
    View, RouterView, Route
} from "./common";
import { prompt, InputQuestion } from "inquirer";


export class UserView extends RouterView {
    protected choices = [
        new Route("切换用户", new SwitchUserView().invoke),
        new Route("新建用户", new CreateUserView().invoke)
    ]
}


export class CreateUserView extends View {
    private validateUsername(username: string): boolean | string {
        if (!username) {
            return "用户名不能为空。";
        }

        if (username.length > 16) {
            return "用户名不能超过 16 字符。";
        }
    }

    public async invoke(): Promise<void> {
        enum answerKeys {
            username,
            shouldCreatePassword,
            password
        }

        const questions = [
            {
                name:     "username",
                type:     "input",
                message:  "请输入用户名",
                validate: this.validateUsername
            } as InputQuestion,
            { name: "createPassword" }
        ];
    }
}


export class SwitchUserView extends View {
    public async invoke(): Promise<void> {
        // @TODO
    }
}
