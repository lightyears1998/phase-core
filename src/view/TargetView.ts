import {
    View, RouterView, Route, InquirerChoiceItemBuilder
} from "./common";
import {
    TargetEntity, TargetStatus, Timespan
} from "../entity";
import {
    prompt, Separator, ListQuestion
} from "inquirer";
import { getApp } from "..";
import { CreateActionView } from "./";
import { TargetController, getActionController, getTargetController } from "../control";
import { NameAndDescriptionQuestion, NameAndDescriptionQuesionAnswer } from "./common/NameAndDescriptionQuestion";


export class TargetView extends RouterView {
    protected choices = [
        new Route("浏览目标", new BrowseTargetView()),
        new Route("新建目标", new CreateTargetView()),
        new Separator(),
        new Route("返回主菜单", null)
    ]
}


export class BrowseTargetView extends View {
    public allowSelectNone: boolean

    private async ask(): Promise<TargetEntity> {
        const user = getApp().getCurrentUser();
        const targets = await (getApp().getController(TargetController) as TargetController).listAllTargetsOfUser(user);

        const choices = new InquirerChoiceItemBuilder().buildTargetListItem(targets);
        if (this.allowSelectNone) {
            choices.unshift({
                name:  "（无）",
                value: null
            });
        }

        if (choices.length === 0) {
            console.log("没有目标可供浏览。")
            return null;
        }

        enum AnswerKey {
            selectedTarget = "selectedTarget"
        }

        const answers = await prompt([
            {
                type:    "list",
                name:    AnswerKey.selectedTarget,
                message: "目标列表",
                choices: choices
            } as ListQuestion
        ]);

        return answers[AnswerKey.selectedTarget];
    }

    public async invoke(): Promise<void> {
        const selectedTarget = await this.ask();
        if (selectedTarget) {
            await new TargetContextView(selectedTarget).invoke();
        }
    }

    public async invokeForResult(option?: { allowSelectNone: boolean }): Promise<TargetEntity> {
        this.allowSelectNone = option.allowSelectNone;
        return this.ask();
    }
}


export class TargetContextView extends RouterView {
    private target: TargetEntity

    public constructor(target: TargetEntity) {
        super();

        this.target = target;
        this.choices = [
            new Route("为目标新增行动", new CreateActionView(this.target)),
            new Route("修改目标", new ModifyTargetView(this.target)),
            new Route("删除目标", new ModifyTargetView(this.target, TargetStatus.DELETED)),
            new Route("返回主菜单", null)
        ];
    }

    public async invoke(): Promise<void> {
        if (!this.target.actions) {
            this.target.actions = await getActionController().listActionsOfTarget(this.target);
        }

        console.log(this.target);
        await super.invoke();
    }
}


export class CreateTargetView extends View {
    public async invoke(): Promise<void> {
        enum AnswerKey {
            nameAndDescription = "nameAndDescription",
            shouldSetTimespan = "shouldSetTimespan",
            startDate = "startDate",
            endDate = "endDate"
        }

        const anwsers = await prompt([
            new NameAndDescriptionQuestion({
                name:    AnswerKey.nameAndDescription,
                message: "目标的标题和细节是？",
                default: `

# 第一行是目标的标题
#
# 第一行之后的是内容
# 以“# ”开始的行会被忽略`
            }),
            {
                type:    "confirm",
                name:    AnswerKey.shouldSetTimespan,
                message: "要设置目标的起止时间吗？"
            },
            {
                type:    "datetime",
                name:    AnswerKey.startDate,
                message: "开始时间",
                format:  [
                    "mm",
                    "/",
                    "dd",
                    "/",
                    "yyyy",
                    " ",
                    "HH",
                    ":",
                    "MM"
                ],
                when: (ans) => (ans[AnswerKey.shouldSetTimespan])
            },
            {
                type:    "datetime",
                name:    AnswerKey.endDate,
                message: "结束时间",
                format:  [
                    "mm",
                    "/",
                    "dd",
                    "/",
                    "yyyy",
                    " ",
                    "HH",
                    ":",
                    "MM"
                ],
                when: (ans) => (ans[AnswerKey.shouldSetTimespan])
            }
        ]);

        const nameAndDescription = (anwsers[AnswerKey.nameAndDescription] as NameAndDescriptionQuesionAnswer);
        const { name, description } = nameAndDescription;

        let target = {
            name,
            description
        } as Partial<TargetEntity>;

        if (anwsers[AnswerKey.shouldSetTimespan]) {
            target.timespan = new Timespan();
            target.timespan.start = anwsers[AnswerKey.startDate];
            target.timespan.end = anwsers[AnswerKey.endDate];
        }

        const user = getApp().getCurrentUser();
        target = await (getApp().getController(TargetController) as TargetController).createTargetForUser(user, target);

        console.log(target);
    }
}


export class ModifyTargetView extends View {
    private target: TargetEntity
    private status?: TargetStatus

    public constructor(target: TargetEntity, status?: TargetStatus) {
        super();

        if (!target) {
            throw TypeError("参数 target 不是正确的类型。");
        }

        this.target = target;
        this.status = status;
    }

    public async invoke(): Promise<void> {
        if (this.status) {
            await this.quesionOnChangingTargetStatus();
        } else {
            await this.questionOnChangingTargetPropertis();
        }
    }

    private async quesionOnChangingTargetStatus() {
        const messageMap = new Map([[TargetStatus.COMPLETED, "确认完成目标？"], [TargetStatus.DELETED, "确认删除目标？"]]);

        const message = messageMap.get(this.status);
        if (!message) {
            throw new TypeError(`参数 status = ${this.status} 尚未支持。`);
        }

        const questionKey = "confirm";
        const answer = await prompt([
            {
                type: "confirm",
                name: questionKey,
                message
            }
        ]);

        console.log(answer);

        if (answer[questionKey]) {
            this.target.status = this.status;
            await getTargetController().updateTarget(this.target);
        }
    }

    private async questionOnChangingTargetPropertis() {
        enum AnswerKey {
            nameAndDescription = "nameAndDescription"
        }

        const answers = await prompt([
            new NameAndDescriptionQuestion(
                {
                    name:    AnswerKey.nameAndDescription,
                    message: "修改目标的名称和描述",
                    default: `${this.target.name}\n\n${this.target.description}`
                }
            )
        ]);

        const nameAndDescription = answers[AnswerKey.nameAndDescription] as NameAndDescriptionQuesionAnswer;
        const { name, description } = nameAndDescription;

        this.target.name = name;
        this.target.description = description;

        this.target = await (getApp().getController(TargetController) as TargetController).updateTarget(this.target);

        console.log(this.target);
    }
}
