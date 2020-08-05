import { View } from "./View";
import * as inquirer from "inquirer";


export class RouterChoice {
    /**
     * 显示在列表中的选项的名称
     */
    public name: string

    /**
     * 选项对应的操作
     */
    public value: () => Promise<void> | void

    /**
     * 完成选择后显示的提示
     */
    public short?: string

    public constructor(name: string, value: () => Promise<void> | void, short?: string) {
        this.name = name;
        this.value = value;
        this.short = short;
    }
}


/**
 * 以列表形式呈现选项，每个选项对应一个函数操作
 */
export abstract class RouterView extends View {
    protected abstract choices: Array<RouterChoice>

    public async invoke(): Promise<void> {
        const questionName = this.name || this.constructor.name;

        const question: inquirer.ListQuestion = {
            name: questionName,
            message: this.name || undefined,
            type: 'list',
            choices: this.choices
        }

        const answer = await inquirer.prompt(question);
        await answer[questionName]();
    }
}
