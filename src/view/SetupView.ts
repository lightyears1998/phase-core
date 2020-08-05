import { ListQuestion } from "inquirer";
import { RouterView, Route } from "./common";
import { UserView } from "./UserView";


export class SetupView extends RouterView {
    protected choices = [
        new Route("用户管理", new UserView().invoke),
        new Route("返回上层", null)
    ]
}
