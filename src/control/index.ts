/* 抽象类 */
export * from "./common";

/* 抽象类的派生类 */
export * from "./ActionController";
export * from "./Exporter";
export * from "./HitokotoService";
export * from "./UserController";
export * from "./Reporter";
export * from "./TargetController";

/* 工具函数 */
import { getApp } from "..";
import { ActionController } from "./ActionController";
import { TargetController } from "./TargetController";

export function getActionController(): ActionController {
    return getApp().getController(ActionController) as ActionController;
}

export function getTargetController(): TargetController {
    return getApp().getController(TargetController) as TargetController;
}
