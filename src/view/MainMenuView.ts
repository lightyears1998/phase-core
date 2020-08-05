
import { View, RouterChoice, RouterView } from "./common";
import { prompt, ListQuestion } from "inquirer";
import { AdvancedConsoleLogger } from "typeorm";
import { app } from "..";


export class MainMenuView extends RouterView {
    protected name = "主菜单";

    protected choices = [
        new RouterChoice("设置", () => { console.log("haha"); }),
        new RouterChoice("退出", () => { app.stop(); })
    ]
}
