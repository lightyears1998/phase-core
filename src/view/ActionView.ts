import {
    View, Route, RouterView
    , NameAndDescriptionQuestion, NameAndDescriptionQuesionAnswer
} from "./common";
import { prompt, Separator } from "inquirer";
import {
    TargetEntity, Action, ActionStatus, Timespan
} from "../entity";

import { BrowseTargetView } from "./TargetView";
import { getApp } from "..";
import { ActionController } from "../control";


function getActionController(): ActionController {
    return getApp().getController(ActionController) as ActionController;
}


export class ActionView extends RouterView {
    protected choices = [
        new Route("浏览行动", new BrowseActionView()),
        new Route("新建行动", new CreateActionView()),
        new Separator(),
        new Route("返回主菜单", null)
    ]
}


/**
 * 按日期浏览目标
 */
export class BrowseActionView extends View {
    public async invoke(): Promise<void> {
        // @todo
    }
}


export class CreateActionView extends View {
    private attchedToTarget: TargetEntity;

    public constructor(attachedToTarget?: TargetEntity) {
        super();

        this.attchedToTarget = attachedToTarget;
    }

    public async invoke(): Promise<void> {
        if (!this.attchedToTarget) {
            this.attchedToTarget = await new BrowseTargetView().invokeForResult({ allowSelectNone: true });
        }

        enum AnswerKey {
            nameAndDescription = "nameAndDescription",
            shouldSetTimespan = "shouldSetTimespan",
            startDate = "startDate",
            endDate = "endDate"
        }

        const anwsers = await prompt([
            new NameAndDescriptionQuestion({
                name:    AnswerKey.nameAndDescription,
                message: "行动的标题和细节是？",
                default: `

# 行动的标题
#
# 对行动步骤的描述。
# 注意，以“#”开始的行会被忽略`
            }),
            {
                type:    "confirm",
                name:    AnswerKey.shouldSetTimespan,
                message: "要设置行动的起止时间吗？"
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

        let action = {
            target: this.attchedToTarget,
            name,
            description
        } as Partial<Action>;

        if (anwsers[AnswerKey.shouldSetTimespan]) {
            action.time = new Timespan();
            action.time.start = anwsers[AnswerKey.startDate];
            action.time.end = anwsers[AnswerKey.endDate];
            action.status = ActionStatus.PLANNED;
        } else {
            action.status = ActionStatus.NOT_PLANNED;
        }

        const user = getApp().getCurrentUser();
        action = await getActionController().createAction(user, action);

        console.log(action);
    }
}
