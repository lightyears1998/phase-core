import { Route, RouterView } from "./common";
import { getApp } from "..";
import { SetupView } from ".";
import Separator from "inquirer/lib/objects/separator";
import { TargetView } from "./TargetView";
import { ActionView } from "./ActionView";
import { FocusView } from "./FocusView";


export class MainMenuView extends RouterView {
    protected name = "主菜单";

    private choicesRequiredUserLoggined = [
        new Route("聚焦", new FocusView()),
        new Route("目标管理", new TargetView()),
        new Route("行动管理", new ActionView())
    ]

    private choicesWithouUserLoggined = [
        new Route("设置", async () => {
            await new SetupView().invoke();
        }),
        new Separator(),
        new Route("退出", () => {
            getApp().stop();
        })
    ]

    protected choices = this.choicesWithouUserLoggined;

    public constructor() {
        super();

        this.choices = this.choicesWithouUserLoggined;
        if (getApp().getCurrentUser()) {
            this.choices = [
                ...this.choicesRequiredUserLoggined,
                new Separator(),
                ...this.choices
            ];
        }
    }
}
