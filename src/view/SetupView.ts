import { RouterView, Route } from "./common";
import { UserView } from "./UserView";
import { AboutView } from "./AboutView";
import Separator from "inquirer/lib/objects/separator";


export class SetupView extends RouterView {
    name = "设置菜单"

    protected choices = [
        new Route("用户管理", new UserView()),
        new Route("关于", new AboutView()),
        new Separator(),
        new Route("返回主菜单", null)
    ];
}
