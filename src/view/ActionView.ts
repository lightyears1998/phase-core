import {
    View, Route, RouterView
} from "./common";
import { Separator } from "inquirer";


export class ActionView extends RouterView {
    protected choices = [
        new Route("浏览行动", new BrowseActionView()),
        new Route("新建行动", new CreateActionView()),
        new Separator(),
        new Route("返回主菜单", null)
    ]
}


export class BrowseActionView extends View {
    public async invoke(): Promise<void> {
        // @todo
    }
}


export class CreateActionView extends View {
    public async invoke(): Promise<void> {
        // @todo
    }
}
