import { RouterView, Route } from "./common";
import { UserView } from "./UserView";
import { AboutView } from "./AboutView";


export class SetupView extends RouterView {
    protected choices = [
        new Route("用户管理", new UserView()),
        new Route("返回主菜单", null),
        new Route("关于", new AboutView())
    ]
}
