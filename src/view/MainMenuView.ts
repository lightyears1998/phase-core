import { Route, RouterView } from "./common";
import { app } from "..";
import { SetupView } from ".";


export class MainMenuView extends RouterView {
    protected name = "主菜单";

    protected choices = [
        new Route("设置", async () => {
            await new SetupView().invoke();
        }),
        new Route("退出", () => {
            app.stop();
        })
    ]
}
