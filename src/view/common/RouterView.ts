import { View } from "./View";
import inquirer from "inquirer";
import Separator from "inquirer/lib/objects/separator";


export class Route {
    /**
     * 显示在列表中的选项的名称
     */
    public name: string

    /**
     * 选项对应的操作
     *
     * - 若为 View 则 invoke；
     * - 若为异步函数，则调用。
     */
    public value: View | (() => Promise<void> | void)

    /**
     * 完成选择后显示的提示
     */
    public short?: string

    public constructor(name: string, value: View | (() => Promise<void> | void), short?: string) {
        this.name = name;
        this.value = value;
        this.short = short;
    }
}


/**
 * 以列表形式呈现选项，每个选项对应一个函数操作
 */
export abstract class RouterView extends View {
    protected choices: Array<Route | Separator> = []

    public async invoke(): Promise<void> {
        const questionName = this.name || this.constructor.name;

        const question: inquirer.ListQuestion = {
            name:    questionName,
            message: this.name || undefined,
            type:    "list",
            choices: this.choices.filter(choice => choice !== null && choice !== undefined)
        };

        const answer = await inquirer.prompt(question);
        const funcOrView = answer[questionName];
        if (funcOrView !== null && funcOrView !== undefined) {
            if (typeof funcOrView === "function") {
                await funcOrView();
            } else if (funcOrView instanceof View) {
                await (funcOrView as View).invoke();
            } else {
                throw TypeError("value 类型必须为 Function 或 View。");
            }
        }
    }
}
