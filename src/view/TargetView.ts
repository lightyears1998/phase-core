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
import { TargetController } from "../control";


export class TargetView extends RouterView {
    protected choices = [
        new Route("浏览目标", new BrowseTargetView()),
        new Route("新建目标", new CreateTargetView()),
        new Separator(),
        new Route("返回主菜单", null)
    ]
}


export class BrowseTargetView extends View {
    public async invoke(): Promise<void> {
        const user = getApp().getCurrentUser();
        const targets = await (getApp().getController(TargetController) as TargetController).listAllTargetsOfUser(user);
        const choiceBuilder = new InquirerChoiceItemBuilder();

        enum AnswerKey {
            selectedTarget = "selectedTarget"
        }

        const answers = await prompt([
            {
                type:    "list",
                name:    AnswerKey.selectedTarget,
                message: "目标列表",
                choices: choiceBuilder.buildTargetListItem(targets)
            } as ListQuestion
        ]);

        const selectedTarget = answers[AnswerKey.selectedTarget];

        await new TargetContextView(selectedTarget).invoke();
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
            new Route("返回主菜单", null)
        ]
    }

    public async invoke(): Promise<void> {
        this.target = await (getApp().getController(TargetController) as TargetController).loadActionsOfTarget(this.target)
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
            {
                type:    "editor",
                name:    AnswerKey.nameAndDescription,
                message: "目标的标题和细节是？",
                default: `

# 第一行是目标的标题
#
# 第一行之后的是内容
# 以“# ”开始的行会被忽略`
            },
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
                ]
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
                ]
            }
        ]);

        const nameAndDescription = (anwsers[AnswerKey.nameAndDescription] as string).trim().split("\n").filter(line => !line.startsWith("#"));
        const name = nameAndDescription[0];
        const description = nameAndDescription.slice(1).join("\n").trim();

        const target = {
            name,
            description
        } as Partial<TargetEntity>;

        if (anwsers[AnswerKey.shouldSetTimespan]) {
            target.timespan = new Timespan();
            target.timespan.start = anwsers[AnswerKey.startDate];
            target.timespan.end = anwsers[AnswerKey.endDate];
        }

        console.log(target);

        const user = getApp().getCurrentUser();
        await (getApp().getController(TargetController) as TargetController).createTargetForUser(user, target);
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
        if (status) {
            await this.quesionOnChangingTargetStatus();
        } else {
            await this.questionOnChangingTargetPropertis();
        }
    }

    private async quesionOnChangingTargetStatus() {
        const messageMap = new Map([[TargetStatus.COMPLETED, "确认完成行动？"], [TargetStatus.DELETED, "确认删除行动？"]]);

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

        if (answer.questionKey) {
            // @todo
        }
    }

    private async questionOnChangingTargetPropertis() {
        // @todo
    }
}
