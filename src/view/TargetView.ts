import {
    View, RouterView, Route
} from "./common";
import {
    TargetEntity, TargetStatus, Timespan
} from "../entity";
import { prompt, Separator } from "inquirer";
import { getApp } from "..";
import { TargetController } from "../control";
import * as fuzzy from "fuzzy";


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

        const choices = targets.map(target => target.name);

        const searchTargets = (_: unknown, input: string | undefined) => {
            input = input || "";
            return new Promise((resolve) => {
                const result = fuzzy.filter(input, choices);
                resolve(result.map(item => item.original));
            })
        }

        enum AnswerKey {
            selectedTarget = "selectedTarget"
        }

        const answers = await prompt([
            {
                type: "autocomplete",
                name: AnswerKey.selectedTarget,
                message: "现有目标",
                source: searchTargets
            }
        ])

        console.log(answers);
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
                message: "要设置目标的起止时间吗？",
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
