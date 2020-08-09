import { EntityManager, Not } from "typeorm";
import { App } from "..";
import { StaticController } from "./common";
import {
    User, Action, TargetEntity, ActionStatus
} from "../entity";


export class ActionController extends StaticController {
    private db: EntityManager

    public constructor(app: App) {
        super(app);
        this.db = app.getMainDBManager();
    }

    public async createAction(user: User, action: Partial<Action>): Promise<Action> {
        action.owner = user;
        return this.db.save(Action, action as Action);
    }

    public async updateAction(user: User, action: Partial<Action>): Promise<Action> {
        action.owner = user;
        return this.db.save(Action, action as Action);
    }

    public async listActionOfTarget(target: TargetEntity): Promise<Action[]> {
        return this.db.find(Action, {
            where: {
                target,
                status: Not(ActionStatus.DELETED)
            }
        });
    }
}
